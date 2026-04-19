import React, { useRef, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Markdown ↔ HTML helpers
// ─────────────────────────────────────────────────────────────────────────────
function mdToHtml(md: string): string {
  return md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/~~(.*?)~~/g, "<del>$1</del>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br>");
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
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/div>/gi, "")
    .replace(/<div>/gi, "\n")
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
    total += textNode.textContent?.length ?? 0; // ✅ fix TS18047
  }
  return total;
}

function setTextOffset(root: Node, targetOffset: number): void {
  let total = 0;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const textNode = walker.currentNode as Text;
    const len = textNode.textContent?.length ?? 0; // ✅ fix TS18047
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
  // Fallback: end of last text node
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
// Wrap guard: strips double-markers like ****text**** → **text**, etc.
// ─────────────────────────────────────────────────────────────────────────────
function cleanDoubleWraps(md: string): string {
  // Remove doubled markers: ****x**** → **x**, ~~x~~~~ → ~~x~~ etc.
  // For bold (**), doubled = ****; for italic (*), doubled = ** which is bold — handled via context
  md = md.replace(/\*{4}(.*?)\*{4}/g, "**$1**"); // ****x**** → **x**
  md = md.replace(/~{4}(.*?)~{4}/g, "~~$1~~"); // ~~~~x~~~~ → ~~x~~
  md = md.replace(/``(.*?)``/g, "`$1`"); // ``x`` → `x`
  // Clean up **  ** that collapse to nothing
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

  // ─── Read-only sync: extract markdown and notify parent, never touch DOM ────
  // Used by handleInput so that normal typing (space, backspace, letters) is
  // never interrupted by a DOM replacement.
  const readMarkdown = useCallback(() => {
    if (isUpdatingRef.current || !editorRef.current) return;
    const raw = htmlToMd(editorRef.current.innerHTML);
    const cleaned = cleanDoubleWraps(raw);

    // If the editor is visually empty (only a lone <br> left by the browser),
    // hard-clear so the :empty placeholder reappears.
    const isEmpty =
      cleaned === "" &&
      editorRef.current.childNodes.length <= 1 &&
      (editorRef.current.childNodes.length === 0 ||
        (editorRef.current.firstChild as HTMLElement)?.tagName === "BR");

    if (isEmpty) {
      isUpdatingRef.current = true;
      while (editorRef.current.firstChild) {
        editorRef.current.removeChild(editorRef.current.firstChild);
      }
      isUpdatingRef.current = false;
    }

    onChangeRef.current(isEmpty ? "" : cleaned);
  }, []);

  // ─── Write sync: re-render DOM from markdown (used after wrap operations) ──
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
        while (editorRef.current.firstChild) {
          editorRef.current.removeChild(editorRef.current.firstChild);
        }
      } else {
        editorRef.current.innerHTML = mdToHtml(md);
        setTextOffset(editorRef.current, cursorOffset);
      }
    } finally {
      isUpdatingRef.current = false;
    }
  }, []);

  // ─── Wrap / unwrap ─────────────────────────────────────────────────────────
  const applyWrap = useCallback(
    (wrap: string) => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || !editorRef.current) return;
      const range = sel.getRangeAt(0);
      const text = range.toString();
      if (!text) return;

      const before =
        range.startContainer.textContent?.slice(0, range.startOffset) ?? "";
      const after =
        range.endContainer.textContent?.slice(range.endOffset) ?? "";

      if (before.endsWith(wrap) && after.startsWith(wrap)) {
        // Unwrap
        const newRange = document.createRange();
        newRange.setStart(
          range.startContainer,
          range.startOffset - wrap.length,
        );
        newRange.setEnd(range.endContainer, range.endOffset + wrap.length);
        newRange.deleteContents();
        newRange.insertNode(document.createTextNode(text));
      } else {
        // Wrap — but guard against applying a wrap to already-wrapped text
        // e.g. selecting **foo** and pressing bold should not produce ****foo****
        const stripped =
          text.startsWith(wrap) && text.endsWith(wrap)
            ? text.slice(wrap.length, -wrap.length)
            : text;
        const wrapped = `${wrap}${stripped}${wrap}`;
        range.deleteContents();
        range.insertNode(document.createTextNode(wrapped));
      }

      sel.removeAllRanges();
      // Re-render from the updated markdown so formatting tags are applied
      const md = cleanDoubleWraps(htmlToMd(editorRef.current.innerHTML));
      onChangeRef.current(md);
      writeMarkdown(md);
    },
    [writeMarkdown],
  );

  // ─── Toolbar positioning ───────────────────────────────────────────────────
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

  // ─── Event handlers ────────────────────────────────────────────────────────
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

  // ─── Sync external value → DOM ─────────────────────────────────────────────
  useEffect(() => {
    if (!editorRef.current || isUpdatingRef.current) return;
    const currentMarkdown = htmlToMd(editorRef.current.innerHTML);
    if (currentMarkdown !== value) {
      writeMarkdown(value);
    }
  }, [value, writeMarkdown]);

  // ─── Global selectionchange → toolbar ─────────────────────────────────────
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

  // ─── Initial mount ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (editorRef.current && value) {
      editorRef.current.innerHTML = mdToHtml(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Render ────────────────────────────────────────────────────────────────
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

      {/* Editor */}
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
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default MarkdownEditor;
