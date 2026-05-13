import React, { useRef, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Markdown ↔ HTML helpers (block‑aware, preserves paragraph spacing)
// ─────────────────────────────────────────────────────────────────────────────
function mdToHtml(md: string): string {
  const escaped = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const withInline = escaped
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/~~(.*?)~~/g, "<del>$1</del>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>");

  // Split by double newline -> paragraphs
  const paragraphs = withInline.split(/\n\n/);
  const htmlParagraphs = paragraphs.map((para) => {
    // Inside a paragraph, single newline -> <br>
    const withBreaks = para.replace(/\n/g, "<br>");
    return `<div>${withBreaks}</div>`;
  });
  return htmlParagraphs.join("");
}

function htmlToMd(html: string): string {
  const div = document.createElement("div");
  div.innerHTML = html;

  div
    .querySelectorAll("strong")
    .forEach((el) => el.replaceWith(`**${el.textContent}**`));
  div
    .querySelectorAll("del")
    .forEach((el) => el.replaceWith(`~~${el.textContent}~~`));
  div
    .querySelectorAll("em")
    .forEach((el) => el.replaceWith(`*${el.textContent}*`));
  div
    .querySelectorAll("code")
    .forEach((el) => el.replaceWith("`" + el.textContent + "`"));

  let text = div.innerHTML;
  text = text
    .replace(/<\/div><div>/gi, "\n\n") // paragraph separator
    .replace(/<\/div>/gi, "")
    .replace(/<div>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

  return text.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// Cursor helpers
// ─────────────────────────────────────────────────────────────────────────────
function getTextOffset(root: Node, node: Node, offset: number): number {
  let total = 0;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const textNode = walker.currentNode as Text;
    if (textNode === node) return total + offset;
    total += textNode.textContent?.length ?? 0;
  }
  return total;
}

function setTextOffset(root: Node, targetOffset: number): void {
  let total = 0;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const textNode = walker.currentNode as Text;
    const len = textNode.textContent?.length ?? 0;
    if (total + len >= targetOffset) {
      const range = document.createRange();
      range.setStart(textNode, targetOffset - total);
      range.collapse(true);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      return;
    }
    total += len;
  }
  const fallbackWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let lastNode: Text | null = null;
  while (fallbackWalker.nextNode())
    lastNode = fallbackWalker.currentNode as Text;
  if (lastNode) {
    const range = document.createRange();
    range.setStart(lastNode, lastNode.textContent?.length ?? 0);
    range.collapse(true);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Wrap guard: strips double-markers like ****text**** → **text**
// ─────────────────────────────────────────────────────────────────────────────
function cleanDoubleWraps(md: string): string {
  md = md.replace(/\*{4}(.*?)\*{4}/g, "**$1**");
  md = md.replace(/~{4}(.*?)~{4}/g, "~~$1~~");
  md = md.replace(/``(.*?)``/g, "`$1`");
  md = md.replace(/\*\*\s*\*\*/g, "");
  md = md.replace(/~~\s*~~/g, "");
  md = md.replace(/``/g, "");
  return md;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
interface MarkdownEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  className?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Type with **bold**, *italic*, ~~strike~~, `code`…",
  className = "",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);

  useEffect(() => {
    onChangeRef.current = onChange;
    valueRef.current = value;
  }, [onChange, value]);

  // ─── Read-only sync: extract markdown and notify parent
  const readMarkdown = useCallback(() => {
    if (isUpdatingRef.current || !editorRef.current) return;
    const raw = htmlToMd(editorRef.current.innerHTML);
    const cleaned = cleanDoubleWraps(raw);

    const isEmpty =
      cleaned === "" &&
      editorRef.current.childNodes.length <= 1 &&
      (editorRef.current.childNodes.length === 0 ||
        (editorRef.current.firstChild as HTMLElement)?.tagName === "BR");

    if (isEmpty) {
      isUpdatingRef.current = true;
      // Reset formatting completely
      editorRef.current.innerText = "";
      isUpdatingRef.current = false;
    }

    onChangeRef.current(isEmpty ? "" : cleaned);
  }, []);

  // ─── Write sync: re-render DOM from markdown
  const writeMarkdown = useCallback((md: string) => {
    if (!editorRef.current) return;
    isUpdatingRef.current = true;
    try {
      const sel = window.getSelection();
      let cursorOffset = 0;
      if (sel?.rangeCount && editorRef.current.contains(sel.anchorNode)) {
        cursorOffset = getTextOffset(
          editorRef.current,
          sel.anchorNode!,
          sel.anchorOffset,
        );
      }
      if (md === "") {
        // Clear and reset formatting state
        editorRef.current.innerText = "";
      } else {
        editorRef.current.innerHTML = mdToHtml(md);
        setTextOffset(editorRef.current, cursorOffset);
      }
    } finally {
      isUpdatingRef.current = false;
    }
  }, []);

  // ─── Apply formatting on the raw Markdown string (fixes spacing & double wraps)
  const applyWrap = useCallback(
    (wrap: string) => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || !editorRef.current) return;
      const range = sel.getRangeAt(0);
      const selectedText = range.toString();
      if (!selectedText) return;

      const fullMarkdown = htmlToMd(editorRef.current.innerHTML);
      const startPlain = getTextOffset(
        editorRef.current,
        range.startContainer,
        range.startOffset,
      );
      const endPlain = startPlain + selectedText.length;

      let mdStart = -1,
        mdEnd = -1;
      let plainPos = 0;
      for (let i = 0; i < fullMarkdown.length; i++) {
        if (plainPos === startPlain && mdStart === -1) mdStart = i;
        if (plainPos === endPlain) {
          mdEnd = i;
          break;
        }
        if ("*_~`".includes(fullMarkdown[i])) {
          if (
            (fullMarkdown[i] === "*" && fullMarkdown[i + 1] === "*") ||
            (fullMarkdown[i] === "~" && fullMarkdown[i + 1] === "~")
          ) {
            i += 1;
          }
          continue;
        } else {
          plainPos++;
        }
      }
      if (mdEnd === -1) mdEnd = fullMarkdown.length;
      if (mdStart === -1) {
        const idx = fullMarkdown.indexOf(selectedText);
        if (idx !== -1) {
          mdStart = idx;
          mdEnd = idx + selectedText.length;
        } else {
          return;
        }
      }

      const beforeWrap = fullMarkdown.slice(mdStart - wrap.length, mdStart);
      const afterWrap = fullMarkdown.slice(mdEnd, mdEnd + wrap.length);
      let newMarkdown: string;
      let newCursorOffset: number;

      if (beforeWrap === wrap && afterWrap === wrap) {
        // Unwrap
        newMarkdown =
          fullMarkdown.slice(0, mdStart - wrap.length) +
          fullMarkdown.slice(mdStart, mdEnd) +
          fullMarkdown.slice(mdEnd + wrap.length);
        newCursorOffset = mdStart - wrap.length + (mdEnd - mdStart);
      } else {
        // Wrap
        const stripped =
          selectedText.startsWith(wrap) && selectedText.endsWith(wrap)
            ? selectedText.slice(wrap.length, -wrap.length)
            : selectedText;
        const wrappedText = `${wrap}${stripped}${wrap}`;
        newMarkdown =
          fullMarkdown.slice(0, mdStart) +
          wrappedText +
          fullMarkdown.slice(mdEnd);
        newCursorOffset = mdStart + wrappedText.length;
      }

      onChangeRef.current(newMarkdown);
      writeMarkdown(newMarkdown);
      setTimeout(() => {
        setTextOffset(editorRef.current!, newCursorOffset);
      }, 0);
    },
    [writeMarkdown],
  );

  // ─── Toolbar positioning
  const showToolbar = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      toolbarRef.current?.classList.remove(
        "opacity-100",
        "pointer-events-auto",
      );
      toolbarRef.current?.classList.add("opacity-0", "pointer-events-none");
      return;
    }
    if (!editorRef.current || !toolbarRef.current) return;
    if (!editorRef.current.contains(sel.anchorNode)) {
      toolbarRef.current.classList.remove("opacity-100", "pointer-events-auto");
      toolbarRef.current.classList.add("opacity-0", "pointer-events-none");
      return;
    }
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    if (!rect.width) return;
    const editorRect = editorRef.current.getBoundingClientRect();
    const toolbarH = toolbarRef.current.offsetHeight || 38;
    const toolbarW = toolbarRef.current.offsetWidth || 140;
    let left = rect.left - editorRect.left + rect.width / 2 - toolbarW / 2;
    left = Math.max(0, Math.min(left, editorRect.width - toolbarW));
    let top = rect.top - editorRect.top - toolbarH - 8;
    if (rect.top - toolbarH - 8 < 0) top = rect.bottom - editorRect.top + 8;
    toolbarRef.current.style.left = `${left}px`;
    toolbarRef.current.style.top = `${top}px`;
    toolbarRef.current.classList.remove("opacity-0", "pointer-events-none");
    toolbarRef.current.classList.add("opacity-100", "pointer-events-auto");
  }, []);

  const hideToolbar = useCallback(() => {
    toolbarRef.current?.classList.remove("opacity-100", "pointer-events-auto");
    toolbarRef.current?.classList.add("opacity-0", "pointer-events-none");
  }, []);

  // ─── Event handlers
  const handleInput = useCallback(() => readMarkdown(), [readMarkdown]);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
      readMarkdown();
    },
    [readMarkdown],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        if (key === "b") {
          e.preventDefault();
          applyWrap("**");
        }
        if (key === "i") {
          e.preventDefault();
          applyWrap("*");
        }
      }
    },
    [applyWrap],
  );

  // ─── Sync external value → DOM
  useEffect(() => {
    if (!editorRef.current || isUpdatingRef.current) return;
    const currentMarkdown = htmlToMd(editorRef.current.innerHTML);
    if (currentMarkdown !== value) {
      writeMarkdown(value);
    }
  }, [value, writeMarkdown]);

  // ─── Global selectionchange → toolbar
  useEffect(() => {
    const onSelectionChange = () => {
      requestAnimationFrame(() => {
        const sel = window.getSelection();
        if (
          !sel ||
          sel.rangeCount === 0 ||
          sel.isCollapsed ||
          !editorRef.current?.contains(sel.anchorNode)
        ) {
          hideToolbar();
        } else {
          showToolbar();
        }
      });
    };
    document.addEventListener("selectionchange", onSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", onSelectionChange);
  }, [showToolbar, hideToolbar]);

  // ─── Initial mount
  useEffect(() => {
    if (editorRef.current && value) {
      editorRef.current.innerHTML = mdToHtml(value);
    }
  }, []);

  // ─── Render
  return (
    <div className={`relative w-full ${className}`}>
      {/* Floating toolbar */}
      <div
        ref={toolbarRef}
        className="
          absolute z-50 flex gap-0.5 p-1
          bg-white dark:bg-neutral-900
          border border-black/[.12] dark:border-white/[.12]
          rounded-xl shadow-md
          whitespace-nowrap
          opacity-0 pointer-events-none
          transition-opacity duration-100
        "
      >
        {[
          {
            wrap: "**",
            title: "Bold",
            label: <b>B</b>,
            extraClass: "font-bold",
          },
          { wrap: "*", title: "Italic", label: <i>I</i>, extraClass: "italic" },
          {
            wrap: "~~",
            title: "Strikethrough",
            label: <s>S</s>,
            extraClass: "line-through",
          },
          {
            wrap: "`",
            title: "Code",
            label: <span>{"</>"}</span>,
            extraClass: "font-mono",
          },
        ].map(({ wrap, title, label, extraClass }) => (
          <button
            key={wrap}
            title={title}
            className={`
              w-[30px] h-[30px] rounded-lg border-none
              bg-transparent cursor-pointer
              flex items-center justify-center
              text-[13px] text-neutral-500 dark:text-neutral-400
              hover:bg-neutral-100 dark:hover:bg-neutral-800
              hover:text-neutral-900 dark:hover:text-neutral-100
              transition-colors duration-100
              ${extraClass}
            `}
            onPointerDown={(e) => {
              e.preventDefault();
              applyWrap(wrap);
              hideToolbar();
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Editor – native selection modal suppressed */}
      <div
        ref={editorRef}
        className="
          min-h-[80px] w-full
          rounded-xl
          px-3.5 py-2.5
          text-[15px] leading-relaxed
          outline-none
          font-[inherit]
          text-neutral-900 dark:text-neutral-100
          bg-white dark:bg-neutral-900
          border-2 border-neutral-200 dark:border-neutral-700
          focus:border-[#33157A] dark:focus:border-[#9d7dea]
          transition-colors duration-150
          break-words
          empty:before:content-[attr(data-placeholder)]
          empty:before:text-neutral-400
          empty:before:pointer-events-none
          [&_strong]:font-bold
          [&_em]:italic
          [&_del]:line-through
          [&_code]:font-mono
          [&_code]:text-[13px]
          [&_code]:bg-neutral-100
          dark:[&_code]:bg-neutral-800
          [&_code]:rounded
          [&_code]:px-1
          [&_code]:py-px
        "
        style={{ WebkitTouchCallout: "none" } as React.CSSProperties}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default MarkdownEditor;
