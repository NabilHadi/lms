"use client";

import * as z from "zod";
import axios from "axios";

import { File, Loader2, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course, TMAMarkedFile, TutorMarkAssignment } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/fie-upload";

import { StudentTMASubmission } from "@prisma/client";

interface GradeTmaFormProps {
  studentSubmission: StudentTMASubmission;
  tmaMarkedFile: TMAMarkedFile | null;
  totalGrade: number;
}

const GradeTmaForm = ({
  studentSubmission,
  totalGrade,
  tmaMarkedFile,
}: GradeTmaFormProps) => {
  const formSchema = z.object({
    url: z.string().min(1),
    name: z.string(),
    key: z.string(),
    size: z.string(),
    grade: z.number().min(0).max(totalGrade),
  });
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [grade, setGrade] = useState<number>(0);

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/courses/${studentSubmission.courseId}/tma/${studentSubmission.tmaId}/mark/${studentSubmission.id}`,
        values
      );
      toast.success("TMA Marked");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(
        `/api/courses/${studentSubmission.courseId}/tma/${studentSubmission.tmaId}/mark/${studentSubmission.id}`
      );
      toast.success("TMA marked file deleted");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGrade(Number(e.target.value));
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Add Mark file for TMA
        <Button
          onClick={toggleEditing}
          variant="ghost"
          disabled={!!tmaMarkedFile}
        >
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Mark TMA
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {!tmaMarkedFile && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No Mark File Uploaded yet
            </p>
          )}
          {tmaMarkedFile && (
            <div className="space-y-2">
              <div className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md">
                <File className="h-4 w-4 mr-2 flex-shrink-0" />
                <p className="text-sm line-clamp-1">{tmaMarkedFile.name}</p>
                {deletingId === tmaMarkedFile.id && (
                  <div className="ml-auto ">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
                {deletingId !== tmaMarkedFile.id && (
                  <button
                    className="ml-auto hover:opacity-75 transition"
                    onClick={() => onDelete(tmaMarkedFile.id)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="tmaMarkedFile"
            onUploadComplete={({ url, name, key, size }) => {
              if (url) {
                onSubmit({
                  url,
                  name,
                  key,
                  size: size + "",
                  grade: grade || 0,
                });
              }
            }}
          />
          <div className="m-2 flex justify-start items-center gap-3">
            <label htmlFor="grade">Grade</label>
            <input
              className="border-2 border-gray-400-300 shadow-sm rounded-md p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-gray-400"
              type="text"
              name="grade"
              id="grade"
              value={grade}
              onChange={onInputChange}
            />
            <div className="text-xs text-muted-foreground mt-4">
              Default is 0
            </div>
          </div>

          <div className="text-xs text-muted-foreground mt-4">
            Add your marked file for this TMA submission
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeTmaForm;
