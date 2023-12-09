import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, File } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import GradeTmaForm from "./_components/grade-tma-form";

const TmaSubmissionPage = async ({
  params,
}: {
  params: {
    courseId: string;
    tmaId: string;
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
  });

  const studentTMASubmission = await db.studentTMASubmission.findUnique({
    where: {
      id: params.tmaId,
    },
    include: {
      tma: true,
      markedFile: true,
    },
  });

  if (!course || !studentTMASubmission) {
    return redirect("/");
  }

  return (
    <div className="p-4 flex flex-col  mx-auto pb-20">
      <div className="flex items-center justify-between pr-2">
        <h1 className="font-semibold text-3xl">Course: {course.title}</h1>
        <Link className="flex" href={`/teacher/courses/${course.id}/tma`}>
          <Button className="" variant={"outline"}>
            <ArrowLeft size={"1.2rem"} />
            Back
          </Button>
        </Link>
      </div>
      <div className="my-6 p-4 border bg-slate-100 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Course TMA</h3>
        <a
          href={studentTMASubmission.tma.url}
          target="_blank"
          className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
        >
          <File />
          <p className="ml-1 line-clamp-1">{studentTMASubmission.tma.name}</p>
        </a>
        <p className="mt-2  ">
          Total Grade: {studentTMASubmission.tma.totalGrade}
        </p>
      </div>
      <div>
        <Separator />
      </div>
      <h2 className="text-2xl font-bold my-4">Mark/Grade Student TMA</h2>
      <table className="w-full border-y rounded border-spacing-3 border-separate">
        <thead>
          <tr>
            <th className="text-left">Student ID</th>
            <th className="text-left">File name</th>
            <th className="text-left">Grade</th>
            <th className="text-left">Submitted At</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b last:border-b-0 my-2">
            <td className="text-left">{studentTMASubmission.studentId}</td>
            <td className="text-left">{studentTMASubmission.name}</td>
            <td className="text-left">
              {studentTMASubmission.grade || "Not Marked yet"}
            </td>
            <td className="text-left flex flex-col flex-wrap">
              <span>{studentTMASubmission.createdAt.toLocaleDateString()}</span>
              <span>{studentTMASubmission.createdAt.toLocaleTimeString()}</span>
            </td>
            <td className="text-left">
              <Link href={studentTMASubmission.url}>
                <Button className="bg-lime-600">Download</Button>
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
      <GradeTmaForm
        studentSubmission={studentTMASubmission}
        totalGrade={studentTMASubmission.tma.totalGrade}
        tmaMarkedFile={studentTMASubmission.markedFile}
      />
    </div>
  );
};

export default TmaSubmissionPage;
