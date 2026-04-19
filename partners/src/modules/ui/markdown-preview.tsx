// components/markdown-preview.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface MarkdownPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
  /** Optional class name for the container */
  className?: string;
  /** Optional class name for paragraphs */
  paragraphClassName?: string;
}

/**
 * Renders markdown text with support for:
 * - **bold** (wrapped in **)
 * - *italic* (wrapped in *)
 * - paragraphs (separated by two newlines)
 */
export function MarkdownPreview({
  content,
  className,
  paragraphClassName,
  ...props
}: MarkdownPreviewProps) {
  if (!content) {
    return null;
  }

  // Split into paragraphs (double newline)
  const paragraphs = content.split(/\n\s*\n/);

  return (
    <div className={cn("prose max-w-none", className)} {...props}>
      {paragraphs.map((paragraph, idx) => {
        // Skip empty paragraphs
        if (!paragraph.trim()) return null;

        // Parse inline formatting: **bold** and *italic*
        const parts = paragraph.split(/(\*\*.*?\*\*|\*.*?\*)/g);

        const renderedParagraph = (
          <p key={idx} className={paragraphClassName}>
            {parts.map((part, i) => {
              // Bold
              if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
              }
              // Italic
              if (
                part.startsWith("*") &&
                part.endsWith("*") &&
                part.length > 2
              ) {
                return <em key={i}>{part.slice(1, -1)}</em>;
              }
              // Plain text
              return part;
            })}
          </p>
        );

        return renderedParagraph;
      })}
    </div>
  );
}
