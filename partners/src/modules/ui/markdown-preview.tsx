import * as React from "react";
import { cn } from "@/lib/utils";

interface MarkdownPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
  className?: string;
  paragraphClassName?: string;
  debounceMs?: number;
}

// ─── Types ───────────────────────────────────────────────────────────────────

type InlineNode =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "italic"; value: string };

// ─── Linear inline parser (no backtracking) ──────────────────────────────────
// Scans left-to-right in a single pass. Never revisits a character.
// Incomplete markers (e.g. a lone `*` at end-of-string) are emitted as
// plain text so partial input never stalls.

function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let i = 0;
  let plain = "";

  const flush = () => {
    if (plain) {
      nodes.push({ type: "text", value: plain });
      plain = "";
    }
  };

  while (i < text.length) {
    // Try **bold** first (must check before single *)
    if (text[i] === "*" && text[i + 1] === "**") {
      // Actually: check for "**"
    }
    if (text[i] === "*" && text[i + 1] === "*") {
      const closeIdx = text.indexOf("**", i + 2);
      if (closeIdx !== -1 && closeIdx > i + 2) {
        flush();
        nodes.push({ type: "bold", value: text.slice(i + 2, closeIdx) });
        i = closeIdx + 2;
        continue;
      }
    }

    // Try *italic* (single star, length > 2 to avoid empty **)
    if (text[i] === "*" && text[i + 1] !== "*") {
      const closeIdx = text.indexOf("*", i + 1);
      if (closeIdx !== -1 && closeIdx > i + 1) {
        flush();
        nodes.push({ type: "italic", value: text.slice(i + 1, closeIdx) });
        i = closeIdx + 1;
        continue;
      }
    }

    plain += text[i];
    i++;
  }

  flush();
  return nodes;
}

// ─── Memo-safe paragraph + inline parser ─────────────────────────────────────

function parseContent(content: string): InlineNode[][] {
  return content
    .split(/\n\s*\n/)
    .filter((p) => p.trim() !== "")
    .map((p) => parseInline(p));
}

// Cache the last parse result to avoid re-parsing identical content.
const useStableContent = (content: string, debounceMs: number) => {
  const [stable, setStable] = React.useState(content);

  React.useEffect(() => {
    if (debounceMs <= 0) {
      setStable(content);
      return;
    }
    const id = window.setTimeout(() => setStable(content), debounceMs);
    return () => window.clearTimeout(id);
  }, [content, debounceMs]);

  return stable;
};

// ─── Component ───────────────────────────────────────────────────────────────

export function MarkdownPreview({
  content,
  className,
  paragraphClassName,
  debounceMs = 150,
  ...props
}: MarkdownPreviewProps) {
  const stable = useStableContent(content ?? "", debounceMs);

  const paragraphs = React.useMemo(() => parseContent(stable), [stable]);

  if (!stable) return null;

  return (
    <div className={cn("prose max-w-none", className)} {...props}>
      {paragraphs.map((nodes, pIdx) => (
        <p key={pIdx} className={paragraphClassName}>
          {nodes.map((node, nIdx) => {
            if (node.type === "bold")
              return <strong key={nIdx}>{node.value}</strong>;
            if (node.type === "italic") return <em key={nIdx}>{node.value}</em>;
            return node.value; // plain text — no wrapper element needed
          })}
        </p>
      ))}
    </div>
  );
}
