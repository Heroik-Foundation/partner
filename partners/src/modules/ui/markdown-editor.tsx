import {
  useMemo,
  forwardRef,
  useRef,
  useImperativeHandle,
} from "react";
import DefaultEditor, { ContentEditableEvent } from "react-simple-wysiwyg";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: number | string;
  maxHeight?: number | string;
  disabled?: boolean;
  autoFocus?: boolean;
  id?: string;
}

export interface MarkdownEditorRef {
  focus: () => void;
  insertText: (text: string) => void;
  setValue: (value: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export const MarkdownEditor = forwardRef<MarkdownEditorRef, MarkdownEditorProps>(
  (
    {
      value = "",
      onChange,
      placeholder = "Write your content here...",
      className = "",
      minHeight = 160,
      maxHeight = 480,
      disabled = false,
      autoFocus = false,
      id,
    },
    ref,
  ) => {
    const editorRef = useRef<HTMLDivElement>(null);

    // Expose imperative handle
    useImperativeHandle(ref, () => ({
      focus: () => editorRef.current?.focus(),
      insertText: (text: string) => {
        if (editorRef.current) {
          editorRef.current.focus();
          document.execCommand("insertText", false, text);
        }
      },
      setValue: (val: string) => {
        onChange(val || "");
      },
    }));

    // Word & char count stats
    const stats = useMemo(() => {
      const rawText = (value || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      const words = rawText ? rawText.split(/\s+/).length : 0;
      const chars = (value || "").length;
      return { words, chars };
    }, [value]);

    const minH = typeof minHeight === "number" ? `${minHeight}px` : minHeight;
    const maxH = typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;

    const handleChange = (e: ContentEditableEvent) => {
      onChange(e.target.value);
    };

    return (
      <div className={cn("w-full flex flex-col space-y-1.5", className)}>
        <DefaultEditor
          ref={editorRef}
          id={id}
          value={value || ""}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          containerProps={{
            className: cn(
              "w-full rounded-2xl border-2 border-primary/15 bg-white dark:bg-neutral-900 transition-all duration-200 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 shadow-sm",
              disabled && "opacity-60 pointer-events-none",
            ),
            style: {
              minHeight: minH,
              maxHeight: maxH,
            },
          }}
        />

        {/* ─── Bottom Status Bar ────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-1.5 text-[11px] font-medium text-primary/60 dark:text-neutral-400 select-none">
          {/* Left stats */}
          <div className="flex items-center gap-3">
            <span>
              <strong className="text-primary font-bold">{stats.words}</strong> words
            </span>
            <span>
              <strong className="text-primary font-bold">{stats.chars}</strong> characters
            </span>
          </div>

          {/* Right helper tools */}
          {value?.length > 0 && !disabled && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center gap-1 text-primary/70 hover:text-red-500 transition-colors"
              title="Clear all content"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>
    );
  },
);

MarkdownEditor.displayName = "MarkdownEditor";

export default MarkdownEditor;
