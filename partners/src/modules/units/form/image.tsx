import { useAuthStore } from "@/stores/auth";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const ImageWithPreview = ({
  state,
  setState,
  initialPreview,
  handleState,
}: {
  state?: any;
  setState?: Dispatch<SetStateAction<any>>;
  initialPreview?: string;
  handleState?: (file: any) => void;
}) => {
  const { form, setForm } = useAuthStore();
  const [preview, setPreview] = useState(
    initialPreview || "/image/input-preview.jpg"
  );

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];

    if (setState) {
      setState(file);
    }
    if (handleState) {
      handleState(file);
    }

    if (!setState && !handleState) {
      setForm({
        ...form,
        image: file,
      });
    }

    if (file) {
      handlePreview(file);
    }
  };

  const handlePreview = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    //@ts-ignore
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(previewUrl);
    };
    img.src = previewUrl;
  };

  useEffect(() => {
    if (state) {
      handlePreview(state);
    }
  }, []);

  return (
    <div className="flex flex-col items-center w-full relative">
      <div className="w-full">
        <img
          id="preview_img"
          className="w-full h-56 object-cover rounded-xl"
          src={preview}
          alt="Current profile photo"
        />
      </div>
      <label className="absolute top-5 right-5">
        <span className="sr-only">Choose profile photo</span>
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="file_input"
          accept="jpg, jpeg, png, svg"
        />
        <button
          type="button"
          onClick={() => {
            if (document) {
              //@ts-ignore
              document.getElementById("file_input").click();
            }
          }}
          className="block w-full text-sm
          py-2 px-4
          rounded-full border-0
          font-semibold
          bg-violet-50 text-primary
          hover:bg-violet-100"
        >
          Upload logo
        </button>
      </label>
    </div>
  );
};
