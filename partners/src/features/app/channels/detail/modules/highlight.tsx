import { truncateText } from "@/helpers/text";
import { Hash } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Fragment } from "react/jsx-runtime";

type HighlightProps = {
  thumbnail: string;
  title: string;
  description: string;
  members: number;
  avatars: string[];
};

export const Highlight = (props: HighlightProps) => {
  const { thumbnail, title, description, avatars, members } = props;
  const highlightContentRef = useRef<HTMLDivElement | null>(null);
  const [contentSpacing, setContentSpacing] = useState(0);

  const handleContentSpacing = useCallback(() => {
    if (highlightContentRef.current) {
      const height =
        highlightContentRef.current.getBoundingClientRect().height + 100;

      setContentSpacing(height);
    }
  }, [highlightContentRef.current]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleContentSpacing);
    if (highlightContentRef.current) {
      resizeObserver.observe(highlightContentRef.current);
    }

    return () => {
      if (highlightContentRef.current) {
        resizeObserver.unobserve(highlightContentRef.current);
      }
    };
  }, [highlightContentRef.current]);

  return (
    <Fragment>
      <div className="absolute -top-20 w-full h-96 left-0 right-0 max-w-lg mx-auto">
        {thumbnail ? (
          <img className="w-full h-full object-cover" src={thumbnail} />
        ) : (
          <div className="w-full h-full bg-secondary text-primary flex items-center justify-center">
            <Hash size={32} />
          </div>
        )}
      </div>
      <div
        ref={highlightContentRef}
        className="p-4 bg-primary text-white absolute rounded-3xl space-y-2.5 left-0 right-0 top-44 max-h-52 shadow-lg mx-auto w-[90%] max-w-md text-sm"
      >
        <h1 className="font-black text-2xl text-center">{title}</h1>
        <p className="text-center font-semibold text-sm text-white/75">
          {truncateText(description, 135)}
        </p>

        <div className="w-full flex items-center justify-center">
          <div className="bg-secondary/25 p-2 rounded-full inline-flex space-x-2 items-center">
            <div className="flex -space-x-2">
              {avatars.slice(0, 3).map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt="Avatar"
                  className="w-5 h-5 rounded-full object-fill border-2 border-white"
                />
              ))}
            </div>

            <span className="text-xs font-bold">{members} Attending</span>
          </div>
        </div>
      </div>
      <div
        style={{
          paddingBottom: `${contentSpacing}px`,
        }}
      />
    </Fragment>
  );
};
