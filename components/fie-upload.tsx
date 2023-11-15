"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import toast from "react-hot-toast";
import { UploadFileResponse } from "uploadthing/client";

interface fileUploadProps {
  onUploadComplete: (response: UploadFileResponse) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({ onUploadComplete, endpoint }: fileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (res) {
          onUploadComplete(res[0]);
        }
      }}
      onUploadError={(error: Error) => {
        toast.error(`${error?.message}`);
      }}
    />
  );
};
