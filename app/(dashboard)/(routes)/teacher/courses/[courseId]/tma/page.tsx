import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { StudentTMASubmission, TutorMarkAssignment } from "@prisma/client";
import { ArrowLeft, File } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import StudentTMASubmissionsTable from "./_components/student-tma-submissions-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CourseTMAs = async ({
  params,
}: {
  params: {
    courseId: string;
  };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId: userId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      categoryId: true,
      TutorMarkAssignment: true,
      StudentTMASubmission: true,
    },
  });

  if (!course) {
    return redirect("/");
  }
  return (
    <div className="p-4 flex flex-col  mx-auto pb-20">
      <div className="flex items-center justify-between pr-2">
        <h1 className="font-semibold text-3xl">Course: {course.title}</h1>
        <Link className="flex" href={`/teacher/courses/${course.id}`}>
          <Button className="" variant={"outline"}>
            <ArrowLeft size={"1.2rem"} />
            Back
          </Button>
        </Link>
      </div>
      <div className="my-6 p-4 border bg-slate-100 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Course TMA</h3>
        <a
          href={course.TutorMarkAssignment[0].url}
          target="_blank"
          className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
        >
          <File />
          <p className="ml-1 line-clamp-1">
            {course.TutorMarkAssignment[0].name}
          </p>
        </a>
        <p className="mt-2  ">
          Total Grade: {course.TutorMarkAssignment[0].totalGrade}
        </p>
      </div>
      <div>
        <Separator />
      </div>
      <StudentTMASubmissionsTable
        stduentTMASubmission={course.StudentTMASubmission}
      />
    </div>
  );
};

export default CourseTMAs;
