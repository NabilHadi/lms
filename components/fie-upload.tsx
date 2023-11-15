"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import toast from "react-hot-toast";

interface fileUploadProps {
  onUploadComplete: ({ url, name }: { url?: string; name?: string }) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({ onUploadComplete, endpoint }: fileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onUploadComplete({ url: res?.[0].url, name: res?.[0].name });
      }}
      onUploadError={(error: Error) => {
        toast.error(`${error?.message}`);
      }}
    />
  );
};
