import { Button } from "@/components/ui/button";
import { StudentTMASubmission } from "@prisma/client";
import Link from "next/link";

interface StudentTMASubmissionsTableProps {
  stduentTMASubmission: StudentTMASubmission[];
}

const StudentTMASubmissionsTable = ({
  stduentTMASubmission,
}: StudentTMASubmissionsTableProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold my-4">Student TMA Submissions</h2>
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
          {stduentTMASubmission.map((submission) => (
            <tr key={submission.id} className="border-b last:border-b-0 my-2">
              <td className="text-left">{submission.studentId}</td>
              <td className="text-left">{submission.name}</td>
              <td className="text-left">
                {submission.grade || "Not Marked yet"}
              </td>
              <td className="text-left flex flex-col flex-wrap">
                <span>{submission.createdAt.toLocaleDateString()}</span>
                <span>{submission.createdAt.toLocaleTimeString()}</span>
              </td>
              <td className="text-left">
                <Link href={submission.url}>
                  <Button className="bg-lime-600">Download</Button>
                </Link>
              </td>
              <td className="text-left">
                <Link
                  href={`/teacher/courses/${submission.courseId}/tma/${submission.id}`}
                >
                  <Button className="bg-orange-600">Mark</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTMASubmissionsTable;
