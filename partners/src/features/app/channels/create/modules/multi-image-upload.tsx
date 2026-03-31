import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Dialog, DialogContent } from "@/modules/ui/dialog";

interface Props {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
}

type EditingState = {
  index: number;
  src: string;
  file: File;
  naturalW: number;
  naturalH: number;
};

type CropBox = { x: number; y: number; w: number; h: number };
type Handle = "tl" | "tr" | "bl" | "br" | "t" | "b" | "l" | "r" | "move";

const MIN_CROP = 40;
const OUTPUT_PX = 800;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function MultiImageUpload({ setFiles }: Props) {
  const [previews, setPreviews] = useState<(string | null)[]>(
    Array(5).fill(null),
  );
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [imgRect, setImgRect] = useState({ w: 0, h: 0 });
  const [crop, setCrop] = useState<CropBox>({ x: 0, y: 0, w: 0, h: 0 });
  const [activeHandle, setActiveHandle] = useState<Handle | null>(null);

  const dragRef = useRef<{
    startMx: number;
    startMy: number;
    startCrop: CropBox;
    handle: Handle;
  } | null>(null);

  const imgElRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const placeholderImg = "/image/multi-image-preview.svg";

  // ─── Compute rendered image dimensions ────────────────────────────────────
  // We measure the <img> element directly so the crop coordinate space always
  // matches the pixels the user actually sees, regardless of device pixel ratio
  // or dialog size changes.
  const measureImg = useCallback(() => {
    const el = imgElRef.current;
    if (!el) return;
    // Use offsetWidth/Height (excludes border/padding, rounds to int) so the
    // SVG overlay is always exactly the same size as the rendered bitmap.
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    setImgRect({ w, h });
    setCrop({ x: 0, y: 0, w, h });
  }, []);

  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    imgElRef.current = e.currentTarget;
    // rAF ensures the browser has finished laying out the dialog before we
    // measure, so offsetWidth reflects the actual rendered size.
    requestAnimationFrame(measureImg);
  };

  // Re-measure if the window resizes while the dialog is open
  useEffect(() => {
    if (!editing) return;
    const onResize = () => requestAnimationFrame(measureImg);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [editing, measureImg]);

  // ─── File handling ─────────────────────────────────────────────────────────
  const openEditor = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const src = reader.result as string;
      const img = new Image();
      img.onload = () => {
        setEditing({
          index,
          src,
          file,
          naturalW: img.naturalWidth,
          naturalH: img.naturalHeight,
        });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // ─── Hit detection ─────────────────────────────────────────────────────────
  const getHandleAtPoint = (
    mx: number,
    my: number,
    c: CropBox,
  ): Handle | null => {
    const HIT = 16; // slightly larger on mobile for easier finger targeting
    const near = (a: number, b: number) => Math.abs(a - b) < HIT;
    if (near(mx, c.x) && near(my, c.y)) return "tl";
    if (near(mx, c.x + c.w) && near(my, c.y)) return "tr";
    if (near(mx, c.x) && near(my, c.y + c.h)) return "bl";
    if (near(mx, c.x + c.w) && near(my, c.y + c.h)) return "br";
    if (near(my, c.y) && mx > c.x && mx < c.x + c.w) return "t";
    if (near(my, c.y + c.h) && mx > c.x && mx < c.x + c.w) return "b";
    if (near(mx, c.x) && my > c.y && my < c.y + c.h) return "l";
    if (near(mx, c.x + c.w) && my > c.y && my < c.y + c.h) return "r";
    if (mx > c.x && mx < c.x + c.w && my > c.y && my < c.y + c.h) return "move";
    return null;
  };

  const getCursor = (h: Handle | null): string => {
    if (!h) return "crosshair";
    const map: Record<Handle, string> = {
      tl: "nw-resize",
      tr: "ne-resize",
      bl: "sw-resize",
      br: "se-resize",
      t: "n-resize",
      b: "s-resize",
      l: "w-resize",
      r: "e-resize",
      move: "move",
    };
    return map[h];
  };

  // ─── Pointer coords relative to the rendered image ────────────────────────
  const pointerRelative = (clientX: number, clientY: number) => {
    const el = imgElRef.current;
    if (!el) return { mx: 0, my: 0 };
    const r = el.getBoundingClientRect();
    return { mx: clientX - r.left, my: clientY - r.top };
  };

  // ─── Pointer down (mouse + touch via pointer events) ──────────────────────
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const { mx, my } = pointerRelative(e.clientX, e.clientY);
    const handle = getHandleAtPoint(mx, my, crop);
    if (!handle) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      startMx: mx,
      startMy: my,
      startCrop: { ...crop },
      handle,
    };
    setActiveHandle(handle);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const { mx, my } = pointerRelative(e.clientX, e.clientY);
    const dx = mx - dragRef.current.startMx;
    const dy = my - dragRef.current.startMy;
    const sc = dragRef.current.startCrop;
    const { w: imgW, h: imgH } = imgRect;
    let { x, y, w, h } = sc;
    const handle = dragRef.current.handle;

    if (handle === "move") {
      x = clamp(sc.x + dx, 0, imgW - w);
      y = clamp(sc.y + dy, 0, imgH - h);
    } else {
      if (handle === "tl" || handle === "l" || handle === "bl") {
        const newX = clamp(sc.x + dx, 0, sc.x + sc.w - MIN_CROP);
        w = sc.w - (newX - sc.x);
        x = newX;
      }
      if (handle === "tr" || handle === "r" || handle === "br") {
        w = clamp(sc.w + dx, MIN_CROP, imgW - sc.x);
      }
      if (handle === "tl" || handle === "t" || handle === "tr") {
        const newY = clamp(sc.y + dy, 0, sc.y + sc.h - MIN_CROP);
        h = sc.h - (newY - sc.y);
        y = newY;
      }
      if (handle === "bl" || handle === "b" || handle === "br") {
        h = clamp(sc.h + dy, MIN_CROP, imgH - sc.y);
      }
    }
    setCrop({ x, y, w, h });
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    dragRef.current = null;
    setActiveHandle(null);
  };

  // ─── Confirm / export ──────────────────────────────────────────────────────
  const handleConfirm = () => {
    if (!editing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Map from rendered-pixel crop coords → natural image pixel coords
    const scaleX = editing.naturalW / imgRect.w;
    const scaleY = editing.naturalH / imgRect.h;
    const sx = crop.x * scaleX;
    const sy = crop.y * scaleY;
    const sw = crop.w * scaleX;
    const sh = crop.h * scaleY;

    canvas.width = OUTPUT_PX;
    canvas.height = Math.round((sh / sw) * OUTPUT_PX);

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const croppedFile = new File([blob], editing.file.name, {
          type: "image/png",
        });
        const dataUrl = canvas.toDataURL("image/png");
        setPreviews((prev) => {
          const n = [...prev];
          n[editing.index] = dataUrl;
          return n;
        });
        setFiles((prev) => {
          const n = [...prev];
          n[editing.index] = croppedFile;
          return n;
        });
        setEditing(null);
      }, "image/png");
    };
    img.src = editing.src;
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Slot strip */}
      <div className="flex items-center justify-between w-full p-1">
        {previews.map((img, idx) => (
          <label
            key={idx}
            htmlFor={`file-input-${idx}`}
            className="cursor-pointer w-14 h-14 md:w-20 md:h-20 xl:w-40 xl:h-40 rounded-md xl:rounded-xl overflow-hidden flex items-center justify-center"
          >
            <input
              id={`file-input-${idx}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) openEditor(idx, file);
                e.target.value = "";
              }}
            />
            <img
              src={img || placeholderImg}
              alt={`upload-${idx}`}
              className="w-full h-full object-cover"
            />
          </label>
        ))}
      </div>

      {/* Crop dialog */}
      <Dialog
        open={!!editing}
        onOpenChange={(o) => {
          if (!o) setEditing(null);
        }}
      >
        {/*
          max-w-[min(520px,95vw)]  → never wider than 95% viewport on mobile
          w-screen on sm and below so it fills the phone screen edge-to-edge
        */}
        <DialogContent className="p-0 overflow-hidden border-0 bg-neutral-950 w-screen sm:w-auto max-w-[min(520px,95vw)]">
          <div className="flex flex-col">
            {/* Image + overlay interaction layer */}
            <div
              ref={containerRef}
              className="relative select-none touch-none w-full"
              style={{ cursor: getCursor(activeHandle) }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              {editing && (
                <img
                  ref={(el) => {
                    imgElRef.current = el;
                  }}
                  src={editing.src}
                  alt="crop"
                  draggable={false}
                  onLoad={handleImgLoad}
                  // w-full + max-h-[60vh] keeps the image fully visible on any
                  // screen while object-contain preserves the natural aspect ratio.
                  // The rendered size is what we measure in measureImg().
                  className="block w-full max-h-[60vh] object-contain"
                  style={{ display: "block" }}
                />
              )}

              {/* SVG overlay — sized to match the rendered image exactly */}
              {editing && imgRect.w > 0 && (
                <svg
                  className="absolute top-0 left-0 pointer-events-none"
                  width={imgRect.w}
                  height={imgRect.h}
                  viewBox={`0 0 ${imgRect.w} ${imgRect.h}`}
                >
                  <defs>
                    <mask id="crop-mask">
                      <rect width="100%" height="100%" fill="white" />
                      <rect
                        x={crop.x}
                        y={crop.y}
                        width={crop.w}
                        height={crop.h}
                        fill="black"
                      />
                    </mask>
                  </defs>

                  {/* Dark surround */}
                  <rect
                    width="100%"
                    height="100%"
                    fill="rgba(0,0,0,0.55)"
                    mask="url(#crop-mask)"
                  />

                  {/* Crop border */}
                  <rect
                    x={crop.x}
                    y={crop.y}
                    width={crop.w}
                    height={crop.h}
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                  />

                  {/* Rule-of-thirds */}
                  {[1, 2].map((i) => (
                    <g key={i}>
                      <line
                        x1={crop.x + (crop.w / 3) * i}
                        y1={crop.y}
                        x2={crop.x + (crop.w / 3) * i}
                        y2={crop.y + crop.h}
                        stroke="rgba(255,255,255,0.25)"
                        strokeWidth="0.75"
                      />
                      <line
                        x1={crop.x}
                        y1={crop.y + (crop.h / 3) * i}
                        x2={crop.x + crop.w}
                        y2={crop.y + (crop.h / 3) * i}
                        stroke="rgba(255,255,255,0.25)"
                        strokeWidth="0.75"
                      />
                    </g>
                  ))}

                  {/* Corner handles — larger on mobile */}
                  {(
                    [
                      [crop.x, crop.y],
                      [crop.x + crop.w, crop.y],
                      [crop.x, crop.y + crop.h],
                      [crop.x + crop.w, crop.y + crop.h],
                    ] as [number, number][]
                  ).map(([hx, hy], i) => (
                    <rect
                      key={i}
                      x={hx - 6}
                      y={hy - 6}
                      width={12}
                      height={12}
                      fill="white"
                      rx="2"
                    />
                  ))}

                  {/* Edge mid-handles */}
                  {(
                    [
                      [crop.x + crop.w / 2, crop.y],
                      [crop.x + crop.w / 2, crop.y + crop.h],
                      [crop.x, crop.y + crop.h / 2],
                      [crop.x + crop.w, crop.y + crop.h / 2],
                    ] as [number, number][]
                  ).map(([hx, hy], i) => (
                    <rect
                      key={i}
                      x={hx - 5}
                      y={hy - 5}
                      width={10}
                      height={10}
                      fill="white"
                      rx="1"
                    />
                  ))}
                </svg>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-950 gap-3">
              <span className="text-xs text-neutral-400 tabular-nums">
                {Math.round(crop.w)} × {Math.round(crop.h)}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 rounded-lg text-sm text-neutral-300 border border-neutral-700 hover:bg-neutral-800 active:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-neutral-950 hover:bg-neutral-200 active:bg-neutral-300 transition-colors"
                >
                  Apply crop
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}
