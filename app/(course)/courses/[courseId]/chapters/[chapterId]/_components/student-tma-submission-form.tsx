"use client";

import * as z from "zod";
import axios from "axios";

import { File, Loader2, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { StudentTMASubmission } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/fie-upload";

interface StudentTMASubmissionFormProps {
  prevStudentTMASubmission?: StudentTMASubmission;
  tmaTitle: string;
  courseId: string;
  tmaId: string;
  totalGrade: number;
}

const formSchema = z.object({
  url: z.string().min(1),
  name: z.string(),
  key: z.string(),
  size: z.string(),
  tmaId: z.string(),
});

const StudentTMASubmissionForm = ({
  prevStudentTMASubmission,
  tmaTitle,
  courseId,
  tmaId,
  totalGrade,
}: StudentTMASubmissionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/student/courses/${courseId}/tma`, values);
      toast.success("TMA uploaded");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/student/courses/${courseId}/tma/${id}`);
      toast.success("TMA deleted");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        {tmaTitle}
        {!prevStudentTMASubmission && (
          <Button onClick={toggleEditing} variant="ghost">
            {isEditing && <>Cancel</>}
            {!isEditing && (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add TMA
              </>
            )}
          </Button>
        )}
      </div>
      {!isEditing && (
        <>
          {prevStudentTMASubmission ? (
            <div className="flex items-center mt-2 bg-slate-200 p-2 rounded">
              <File />
              <a
                href={prevStudentTMASubmission.url}
                target="_blank"
                className="line-clamp-1 ml-2"
              >
                {prevStudentTMASubmission.name}
              </a>
              {deletingId === prevStudentTMASubmission.id && (
                <div className="ml-auto ">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {deletingId !== prevStudentTMASubmission.id && (
                <button
                  className="ml-auto hover:opacity-75 transition"
                  onClick={() => onDelete(prevStudentTMASubmission.id)}
                  disabled={!!deletingId || !!prevStudentTMASubmission.isMarked}
                >
                  {prevStudentTMASubmission.isMarked ? (
                    <span className="font-semibold">{`Graded: ${prevStudentTMASubmission.grade} / ${totalGrade}`}</span>
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm mt-2 text-slate-500 italic">
              Upload your TMA here
            </p>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="stduentTMASubmission"
            onUploadComplete={({ url, name, key, size }) => {
              if (url) {
                onSubmit({
                  url,
                  name,
                  key,
                  size: size + "",
                  tmaId,
                });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            <p>
              <span className="font-semibold">Note:</span> You can only upload
              one TMA at a time.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTMASubmissionForm;
