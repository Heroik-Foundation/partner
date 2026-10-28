import * as React from "react";
import { cn } from "@/lib/utils";

interface MarkdownPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
  className?: string;
  paragraphClassName?: string;
  debounceMs?: number;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type InlineNode =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "italic"; value: string }
  | { type: "strike"; value: string }
  | { type: "code"; value: string }
  | { type: "link"; text: string; href: string };

export type BlockNode =
  | { type: "heading"; level: 1 | 2 | 3; content: InlineNode[] }
  | { type: "blockquote"; content: InlineNode[] }
  | { type: "codeblock"; language?: string; code: string }
  | { type: "bullet_list"; items: InlineNode[][] }
  | { type: "numbered_list"; items: InlineNode[][] }
  | { type: "hr" }
  | { type: "paragraph"; content: InlineNode[] };

// ─── Linear inline parser ─────────────────────────────────────────────────────

export function parseInline(text: string): InlineNode[] {
  // Normalize &nbsp; and other space entities to non-breaking spaces so they never render as literal text
  const cleanText = text.replace(/&(?:amp;)?(?:nbsp|#160|#x0*a0);/gi, "\u00A0");
  const nodes: InlineNode[] = [];
  let i = 0;
  let plain = "";

  const flush = () => {
    if (plain) {
      nodes.push({ type: "text", value: plain });
      plain = "";
    }
  };

  while (i < cleanText.length) {
    // Links: [text](url)
    if (cleanText[i] === "[") {
      const closeBracket = cleanText.indexOf("]", i + 1);
      if (closeBracket !== -1 && cleanText[closeBracket + 1] === "(") {
        const closeParen = cleanText.indexOf(")", closeBracket + 2);
        if (closeParen !== -1) {
          flush();
          const linkText = cleanText.slice(i + 1, closeBracket);
          const linkHref = cleanText.slice(closeBracket + 2, closeParen);
          nodes.push({ type: "link", text: linkText, href: linkHref });
          i = closeParen + 1;
          continue;
        }
      }
    }

    // Bold: **text**
    if (cleanText[i] === "*" && cleanText[i + 1] === "*") {
      const closeIdx = cleanText.indexOf("**", i + 2);
      if (closeIdx !== -1 && closeIdx > i + 2) {
        flush();
        nodes.push({ type: "bold", value: cleanText.slice(i + 2, closeIdx) });
        i = closeIdx + 2;
        continue;
      }
    }

    // Strike: ~~text~~
    if (cleanText[i] === "~" && cleanText[i + 1] === "~") {
      const closeIdx = cleanText.indexOf("~~", i + 2);
      if (closeIdx !== -1 && closeIdx > i + 2) {
        flush();
        nodes.push({ type: "strike", value: cleanText.slice(i + 2, closeIdx) });
        i = closeIdx + 2;
        continue;
      }
    }

    // Code: `text`
    if (cleanText[i] === "`") {
      const closeIdx = cleanText.indexOf("`", i + 1);
      if (closeIdx !== -1 && closeIdx > i + 1) {
        flush();
        nodes.push({ type: "code", value: cleanText.slice(i + 1, closeIdx) });
        i = closeIdx + 1;
        continue;
      }
    }

    // Italic: *text* (single star)
    if (cleanText[i] === "*" && cleanText[i + 1] !== "*") {
      const closeIdx = cleanText.indexOf("*", i + 1);
      if (closeIdx !== -1 && closeIdx > i + 1) {
        flush();
        nodes.push({ type: "italic", value: cleanText.slice(i + 1, closeIdx) });
        i = closeIdx + 1;
        continue;
      }
    }

    plain += cleanText[i];
    i++;
  }

  flush();
  return nodes;
}

// ─── Block parser ─────────────────────────────────────────────────────────────

export function parseBlocks(markdown: string): BlockNode[] {
  const normalized = markdown.replace(/&(?:amp;)?(?:nbsp|#160|#x0*a0);/gi, "\u00A0");
  const blocks: BlockNode[] = [];
  const lines = normalized.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Code block ```
    if (trimmed.startsWith("```")) {
      const lang = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length && lines[i].trim().startsWith("```")) {
        i++;
      }
      blocks.push({
        type: "codeblock",
        language: lang,
        code: codeLines.join("\n"),
      });
      continue;
    }

    // Horizontal rule --- or ***
    if (/^(---|___|\*\*\*)$/.test(trimmed)) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // Headings #, ##, ###
    if (trimmed.startsWith("### ")) {
      blocks.push({
        type: "heading",
        level: 3,
        content: parseInline(trimmed.slice(4)),
      });
      i++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      blocks.push({
        type: "heading",
        level: 2,
        content: parseInline(trimmed.slice(3)),
      });
      i++;
      continue;
    }
    if (trimmed.startsWith("# ")) {
      blocks.push({
        type: "heading",
        level: 1,
        content: parseInline(trimmed.slice(2)),
      });
      i++;
      continue;
    }

    // Blockquote >
    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({
        type: "blockquote",
        content: parseInline(quoteLines.join("\n")),
      });
      continue;
    }

    // Bullet list (- or * )
    if (/^[-*]\s+/.test(trimmed)) {
      const items: InlineNode[][] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(parseInline(lines[i].trim().replace(/^[-*]\s+/, "")));
        i++;
      }
      blocks.push({ type: "bullet_list", items });
      continue;
    }

    // Numbered list (1. )
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: InlineNode[][] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(parseInline(lines[i].trim().replace(/^\d+\.\s+/, "")));
        i++;
      }
      blocks.push({ type: "numbered_list", items });
      continue;
    }

    // Regular paragraph (accumulate contiguous non-empty lines)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith(">") &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^(---|___|\*\*\*)$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({
        type: "paragraph",
        content: parseInline(paraLines.join("\n")),
      });
    }
  }

  return blocks;
}

// ─── Inline Node Renderer ─────────────────────────────────────────────────────

export function RenderInline({ nodes }: { nodes: InlineNode[] }) {
  return (
    <>
      {nodes.map((node, idx) => {
        if (node.type === "bold") {
          return <strong key={idx} className="font-bold">{node.value}</strong>;
        }
        if (node.type === "italic") {
          return <em key={idx} className="italic">{node.value}</em>;
        }
        if (node.type === "strike") {
          return <del key={idx} className="line-through">{node.value}</del>;
        }
        if (node.type === "code") {
          return (
            <code
              key={idx}
              className="font-mono text-[13px] bg-primary/10 text-primary dark:bg-white/10 dark:text-white rounded px-1.5 py-0.5"
            >
              {node.value}
            </code>
          );
        }
        if (node.type === "link") {
          return (
            <a
              key={idx}
              href={node.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline font-medium hover:opacity-80 transition-opacity"
            >
              {node.text || node.href}
            </a>
          );
        }
        return <span key={idx}>{node.value}</span>;
      })}
    </>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Checks if the markdown or HTML content is effectively empty
 * (i.e. contains only whitespace, HTML tags without visible text/media, or &nbsp; entities).
 */
export function isContentEmpty(content?: string | null): boolean {
  if (!content) return true;

  // Preserve media void elements or markdown void elements that don't have text
  if (/<(img|iframe|video|audio|svg|hr)\b/i.test(content)) {
    return false;
  }
  if (/!\[.*?\]\(.*?\)/.test(content) || /^(---|___|\*\*\*)$/m.test(content)) {
    return false;
  }

  const stripped = content
    .replace(/<[^>]*>/g, "") // strip all HTML tags
    .replace(/&(?:amp;)?(?:nbsp|#160|#x0*a0);/gi, "") // strip &nbsp; entities
    .replace(/[\s\u00A0\u200B-\u200D\uFEFF]/g, ""); // strip whitespace & unicode spaces

  return stripped.length === 0;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function MarkdownPreview({
  content,
  className,
  paragraphClassName,
  debounceMs = 100,
  ...props
}: MarkdownPreviewProps) {
  const [stable, setStable] = React.useState(content ?? "");

  React.useEffect(() => {
    if (debounceMs <= 0) {
      setStable(content ?? "");
      return;
    }
    const id = window.setTimeout(() => setStable(content ?? ""), debounceMs);
    return () => window.clearTimeout(id);
  }, [content, debounceMs]);

  const isEmpty = React.useMemo(() => isContentEmpty(stable), [stable]);
  const isHtml = React.useMemo(() => /<[a-z][\s\S]*>/i.test(stable), [stable]);

  const sanitizedHtml = React.useMemo(() => {
    if (!isHtml) return "";
    return stable.replace(/&amp;nbsp;/gi, "&nbsp;");
  }, [stable, isHtml]);

  const blocks = React.useMemo(
    () => (isHtml || isEmpty ? [] : parseBlocks(stable)),
    [stable, isHtml, isEmpty],
  );

  if (isEmpty) return null;

  if (isHtml) {
    return (
      <div
        className={cn(
          "space-y-2 text-sm leading-relaxed text-inherit break-words",
          "[&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-primary [&_h1]:mt-3 [&_h1]:mb-1",
          "[&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-primary [&_h2]:mt-2 [&_h2]:mb-1",
          "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-primary [&_h3]:mt-2 [&_h3]:mb-1",
          "[&_ul]:list-disc [&_ul]:list-outside [&_ul]:space-y-1 [&_ul]:ml-4 [&_ul]:my-2",
          "[&_ol]:list-decimal [&_ol]:list-outside [&_ol]:space-y-1 [&_ol]:ml-4 [&_ol]:my-2",
          "[&_li]:leading-normal",
          "[&_a]:text-primary [&_a]:underline [&_a]:font-medium hover:[&_a]:opacity-80 [&_a]:cursor-pointer",
          "[&_pre]:bg-neutral-900 [&_pre]:text-neutral-100 [&_pre]:p-3 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:text-[13px] [&_pre]:font-mono [&_pre]:my-2",
          "[&_code]:font-mono [&_code]:text-[13px] [&_code]:bg-primary/10 [&_code]:text-primary [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-3.5 [&_blockquote]:py-1 [&_blockquote]:italic [&_blockquote]:text-primary/80 [&_blockquote]:bg-primary/5 [&_blockquote]:rounded-r-lg [&_blockquote]:my-2",
          className,
        )}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        {...props}
      />
    );
  }

  return (
    <div className={cn("space-y-3 text-sm leading-relaxed text-inherit", className)} {...props}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "heading": {
            if (block.level === 1) {
              return (
                <h1 key={idx} className="text-xl font-bold tracking-tight text-primary mt-3 first:mt-0">
                  <RenderInline nodes={block.content} />
                </h1>
              );
            }
            if (block.level === 2) {
              return (
                <h2 key={idx} className="text-lg font-bold tracking-tight text-primary mt-2 first:mt-0">
                  <RenderInline nodes={block.content} />
                </h2>
              );
            }
            return (
              <h3 key={idx} className="text-base font-semibold text-primary mt-2 first:mt-0">
                <RenderInline nodes={block.content} />
              </h3>
            );
          }
          case "blockquote":
            return (
              <blockquote
                key={idx}
                className="border-l-4 border-primary/40 pl-3.5 py-1 italic text-primary/80 bg-primary/5 rounded-r-lg"
              >
                <RenderInline nodes={block.content} />
              </blockquote>
            );
          case "codeblock":
            return (
              <pre
                key={idx}
                className="bg-neutral-900 text-neutral-100 p-3 rounded-xl overflow-x-auto text-[13px] font-mono leading-normal shadow-inner"
              >
                <code>{block.code}</code>
              </pre>
            );
          case "bullet_list":
            return (
              <ul key={idx} className="list-disc list-inside space-y-1 pl-1">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <RenderInline nodes={item} />
                  </li>
                ))}
              </ul>
            );
          case "numbered_list":
            return (
              <ol key={idx} className="list-decimal list-inside space-y-1 pl-1">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <RenderInline nodes={item} />
                  </li>
                ))}
              </ol>
            );
          case "hr":
            return <hr key={idx} className="border-t border-primary/15 my-3" />;
          case "paragraph":
          default:
            return (
              <p key={idx} className={cn("whitespace-pre-wrap", paragraphClassName)}>
                <RenderInline nodes={block.content} />
              </p>
            );
        }
      })}
    </div>
  );
}

export default MarkdownPreview;
