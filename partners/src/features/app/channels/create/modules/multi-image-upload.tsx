import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
}

export function MultiImageUpload({ files, setFiles }: Props) {
  const [images, setImages] = useState<(string | null)[]>(Array(5).fill(null));
  const placeholderImg = "/image/multi-image-preview.svg";

  const handleChange = (index: number, file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...images];
        newImages[index] = reader.result as string;
        setImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (index: number, file: File | null) => {
    if (file) {
      let newFiles = [...files];
      newFiles[index] = file;
      setFiles(newFiles);
    }
  };

  return (
    <div className="flex items-center justify-between w-full p-1">
      {images.map((img, idx) => (
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
              handleChange(idx, e.target.files?.[0] || null);
              handleFileChange(idx, e.target.files?.[0] || null);
            }}
          />
          <img
            src={img || placeholderImg}
            alt={`upload-${idx}`}
            className="w-full h-full object-cover "
          />
        </label>
      ))}
    </div>
  );
}
