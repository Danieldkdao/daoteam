"use client";

import { SetterType } from "@/lib/types";
import { ImageIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, RefObject, useId } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const AttachImageButton = ({
  image,
  setImage,
  imagePreview,
  setImagePreview,
  fileInputRef,
  ...props
}: {
  image: string | null | undefined;
  setImage: SetterType<string | null | undefined>;
  imagePreview: string | null;
  setImagePreview: SetterType<string | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
} & React.ComponentProps<"button">) => {
  const inputId = useId();

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    onChange: SetterType<string | null | undefined>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      onChange(null);
      return;
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      onChange(null);
      return toast.error(`Invalid file type: ${file.type}`);
    }

    const maxSize = 4 * 1024 * 1024;
    if (file.size > maxSize) {
      onChange(null);
      return toast.error("File too large. Max size 4MB.");
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      onChange(fileReader.result as string);
    };
    fileReader.readAsDataURL(file);
  };

  const resetImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <label htmlFor={inputId}>
        {imagePreview ? (
          <div className="flex items-center gap-2">
            <label htmlFor={inputId} className="cursor-pointer">
              <div className="size-10 relative rounded-md overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Image preview"
                  fill
                  className="object-cover"
                />
              </div>
            </label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="destructive" size="icon" onClick={resetImage}>
                  <XIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Remove image</TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <Button variant="outline" {...props} asChild>
            <label htmlFor={inputId} className="flex items-center gap-2">
              <ImageIcon />
              Attach Image
            </label>
          </Button>
        )}
      </label>
      <Input
        type="file"
        className="hidden"
        id={inputId}
        onChange={(e) => handleFileChange(e, setImage)}
        accept="image/*"
        ref={fileInputRef}
        disabled={props.disabled}
      />
    </div>
  );
};
