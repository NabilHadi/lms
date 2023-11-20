import { db } from "@/lib/db";
import { StudentTMASubmission, TutorMarkAssignment } from "@prisma/client";

interface GetStudentTMASubmissionProps {
  userId: string;
  courseId: string;
}

export const getStudentTMASubmission = async ({
  userId,
  courseId,
}: GetStudentTMASubmissionProps) => {
  try {
    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    let studentTMASubmission: StudentTMASubmission[] = [];
    let tutorMarkedAssignments: TutorMarkAssignment[] = [];

    studentTMASubmission = await db.studentTMASubmission.findMany({
      where: {
        courseId: course.id,
        studentId: userId,
      },
    });

    tutorMarkedAssignments = await db.tutorMarkAssignment.findMany({
      where: {
        courseId: course.id,
      },
    });

    return {
      studentTMASubmission,
      tutorMarkedAssignments,
    };
  } catch (error) {
    console.log("[GET_STUDENT_TMA]", error);
    return {
      studentTMASubmission: [],
      tutorMarkedAssignments: [],
    };
  }
};
