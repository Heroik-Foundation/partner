import { useAuthStore } from "@/stores/auth";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Dialog, DialogContent } from "@/modules/ui/dialog";

type CropBox = { x: number; y: number; w: number; h: number };
type Handle = "tl" | "tr" | "bl" | "br" | "t" | "b" | "l" | "r" | "move";

const MIN_CROP = 40;
const OUTPUT_PX = 800;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

type NaturalSize = { w: number; h: number };

function useCropEditor() {
  const [editingSrc, setEditingSrc] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState<NaturalSize>({ w: 0, h: 0 });
  const [imgRect, setImgRect] = useState({ w: 0, h: 0 });
  const [crop, setCrop] = useState<CropBox>({ x: 0, y: 0, w: 0, h: 0 });
  const [activeHandle, setActiveHandle] = useState<Handle | null>(null);
  const imgElRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<{
    startMx: number;
    startMy: number;
    startCrop: CropBox;
    handle: Handle;
  } | null>(null);

  const measureImg = useCallback(() => {
    const el = imgElRef.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    setImgRect({ w, h });
    setCrop({ x: 0, y: 0, w, h });
  }, []);

  useEffect(() => {
    if (!editingSrc) return;
    const onResize = () => requestAnimationFrame(measureImg);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [editingSrc, measureImg]);

  const openEditor = (file: File): Promise<File> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const src = reader.result as string;
        const img = new Image();
        img.onload = () => {
          setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
          setEditingSrc(src);
          pendingResolve.current = resolve;
          pendingFile.current = file;
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    });

  const pendingResolve = useRef<((f: File) => void) | null>(null);
  const pendingFile = useRef<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    imgElRef.current = e.currentTarget;
    requestAnimationFrame(measureImg);
  };

  const getHandleAtPoint = (
    mx: number,
    my: number,
    c: CropBox,
  ): Handle | null => {
    const HIT = 16;
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

  const pointerRelative = (clientX: number, clientY: number) => {
    const el = imgElRef.current;
    if (!el) return { mx: 0, my: 0 };
    const r = el.getBoundingClientRect();
    return { mx: clientX - r.left, my: clientY - r.top };
  };

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

  const confirm = () => {
    if (!editingSrc || !canvasRef.current || !pendingFile.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scaleX = naturalSize.w / imgRect.w;
    const scaleY = naturalSize.h / imgRect.h;
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
        if (!blob || !pendingFile.current || !pendingResolve.current) return;
        const cropped = new File([blob], pendingFile.current.name, {
          type: "image/png",
        });
        pendingResolve.current(cropped);
        pendingResolve.current = null;
        pendingFile.current = null;
        setEditingSrc(null);
      }, "image/png");
    };
    img.src = editingSrc;
  };

  const cancel = () => {
    pendingResolve.current = null;
    pendingFile.current = null;
    setEditingSrc(null);
  };

  return {
    editingSrc,
    imgRect,
    crop,
    activeHandle,
    getCursor,
    handleImgLoad,
    imgElRef,
    canvasRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    confirm,
    cancel,
    openEditor,
  };
}

export const ImageWithPreview = ({
  state,
  setState,
  initialPreview,
  handleState,
  buttonText = "Upload Image",
}: {
  state?: File | string;
  setState?: Dispatch<SetStateAction<any>>;
  initialPreview?: string;
  handleState?: (file: File) => void;
  buttonText?: string;
}) => {
  const { form, setForm } = useAuthStore();
  const [preview, setPreview] = useState(
    initialPreview || "/image/input-preview.jpg",
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const crop = useCropEditor();

  const applyFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);

    if (setState) {
      setState(file);
    } else if (handleState) {
      handleState(file);
    } else {
      setForm({ ...form, image: file });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const cropped = await crop.openEditor(file);
    applyFile(cropped);
  };

  useEffect(() => {
    if (initialPreview && !state) setPreview(initialPreview);
  }, [initialPreview]);

  return (
    <>
      <div className="flex flex-col items-center w-full relative">
        <div className="w-full">
          <img
            id="preview_img"
            className="w-full h-56 object-cover rounded-xl object-center"
            src={preview}
            alt="Current profile photo"
          />
        </div>
        <label className="absolute top-5 right-5">
          <span className="sr-only">Choose profile photo</span>
          <input
            ref={inputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="image/jpg,image/jpeg,image/png,image/svg+xml"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="block w-full text-sm py-2 px-4 rounded-full border-0 font-semibold bg-violet-50 text-primary hover:bg-violet-100"
          >
            {buttonText}
          </button>
        </label>
      </div>

      {/* Crop dialog */}
      <Dialog
        open={!!crop.editingSrc}
        onOpenChange={(o) => {
          if (!o) crop.cancel();
        }}
      >
        <DialogContent className="p-0 overflow-hidden border-0 bg-neutral-950 w-screen sm:w-auto max-w-[min(520px,95vw)]">
          <div className="flex flex-col">
            <div
              className="relative select-none touch-none w-full"
              style={{ cursor: crop.getCursor(crop.activeHandle) }}
              onPointerDown={crop.onPointerDown}
              onPointerMove={crop.onPointerMove}
              onPointerUp={crop.onPointerUp}
              onPointerCancel={crop.onPointerUp}
            >
              {crop.editingSrc && (
                <img
                  ref={(el) => {
                    crop.imgElRef.current = el;
                  }}
                  src={crop.editingSrc}
                  alt="crop"
                  draggable={false}
                  onLoad={crop.handleImgLoad}
                  className="block w-full max-h-[60vh] object-contain"
                />
              )}

              {crop.editingSrc && crop.imgRect.w > 0 && (
                <svg
                  className="absolute top-0 left-0 pointer-events-none"
                  width={crop.imgRect.w}
                  height={crop.imgRect.h}
                  viewBox={`0 0 ${crop.imgRect.w} ${crop.imgRect.h}`}
                >
                  <defs>
                    <mask id="iw-crop-mask">
                      <rect width="100%" height="100%" fill="white" />
                      <rect
                        x={crop.crop.x}
                        y={crop.crop.y}
                        width={crop.crop.w}
                        height={crop.crop.h}
                        fill="black"
                      />
                    </mask>
                  </defs>
                  <rect
                    width="100%"
                    height="100%"
                    fill="rgba(0,0,0,0.55)"
                    mask="url(#iw-crop-mask)"
                  />
                  <rect
                    x={crop.crop.x}
                    y={crop.crop.y}
                    width={crop.crop.w}
                    height={crop.crop.h}
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  {[1, 2].map((i) => (
                    <g key={i}>
                      <line
                        x1={crop.crop.x + (crop.crop.w / 3) * i}
                        y1={crop.crop.y}
                        x2={crop.crop.x + (crop.crop.w / 3) * i}
                        y2={crop.crop.y + crop.crop.h}
                        stroke="rgba(255,255,255,0.25)"
                        strokeWidth="0.75"
                      />
                      <line
                        x1={crop.crop.x}
                        y1={crop.crop.y + (crop.crop.h / 3) * i}
                        x2={crop.crop.x + crop.crop.w}
                        y2={crop.crop.y + (crop.crop.h / 3) * i}
                        stroke="rgba(255,255,255,0.25)"
                        strokeWidth="0.75"
                      />
                    </g>
                  ))}
                  {(
                    [
                      [crop.crop.x, crop.crop.y],
                      [crop.crop.x + crop.crop.w, crop.crop.y],
                      [crop.crop.x, crop.crop.y + crop.crop.h],
                      [crop.crop.x + crop.crop.w, crop.crop.y + crop.crop.h],
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
                  {(
                    [
                      [crop.crop.x + crop.crop.w / 2, crop.crop.y],
                      [
                        crop.crop.x + crop.crop.w / 2,
                        crop.crop.y + crop.crop.h,
                      ],
                      [crop.crop.x, crop.crop.y + crop.crop.h / 2],
                      [
                        crop.crop.x + crop.crop.w,
                        crop.crop.y + crop.crop.h / 2,
                      ],
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

            <div className="flex items-center justify-between px-4 py-3 bg-neutral-950 gap-3">
              <span className="text-xs text-neutral-400 tabular-nums">
                {Math.round(crop.crop.w)} × {Math.round(crop.crop.h)}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={crop.cancel}
                  className="px-4 py-2 rounded-lg text-sm text-neutral-300 border border-neutral-700 hover:bg-neutral-800 active:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={crop.confirm}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-neutral-950 hover:bg-neutral-200 active:bg-neutral-300 transition-colors"
                >
                  Apply crop
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <canvas ref={crop.canvasRef} className="hidden" />
    </>
  );
};
