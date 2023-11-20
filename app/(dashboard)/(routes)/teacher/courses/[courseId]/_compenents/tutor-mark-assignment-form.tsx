"use client";

import * as z from "zod";
import axios from "axios";

import { File, Loader2, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course, TutorMarkAssignment } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/fie-upload";

interface TutorMarkAssignmentFormProps {
  initialData: Course & { TutorMarkAssignment: TutorMarkAssignment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
  name: z.string(),
  key: z.string(),
  size: z.string(),
  totalGrade: z.number(),
});

const TutorMarkAssignmentForm = ({
  initialData,
  courseId,
}: TutorMarkAssignmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [totalGrade, setTotalGrade] = useState<number>(100);

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/tma`, values);
      toast.success("TMA updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/tma/${id}`);
      toast.success("TMA deleted");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalGrade(Number(e.target.value));
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        TMA
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add TMA
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.TutorMarkAssignment.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No TMA yet. Add a file to your course to make it available
            </p>
          )}
          {initialData.TutorMarkAssignment.length > 0 && (
            <div className="space-y-2">
              {initialData.TutorMarkAssignment.map((tma) => (
                <div
                  key={tma.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-sm line-clamp-1">{tma.name}</p>
                  {deletingId === tma.id && (
                    <div className="ml-auto ">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== tma.id && (
                    <button
                      className="ml-auto hover:opacity-75 transition"
                      onClick={() => onDelete(tma.id)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="tutorMarkAssignment"
            onUploadComplete={({ url, name, key, size }) => {
              if (url) {
                onSubmit({
                  url,
                  name,
                  key,
                  size: size + "",
                  totalGrade: totalGrade || 100,
                });
              }
            }}
          />
          <div className="m-2 flex justify-start items-center gap-3">
            <label htmlFor="totalGrade">Total Grade</label>
            <input
              className="border-2 border-gray-400-300 shadow-sm rounded-md p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-gray-400"
              type="text"
              name="totalGrade"
              id="totalGrade"
              value={totalGrade}
              onChange={onInputChange}
            />
            <div className="text-xs text-muted-foreground mt-4">
              Default is 100
            </div>
          </div>

          <div className="text-xs text-muted-foreground mt-4">
            Add TMA to your course, so that students can download it.
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorMarkAssignmentForm;
