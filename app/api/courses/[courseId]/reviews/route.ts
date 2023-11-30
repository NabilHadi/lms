import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    // Get the user id from the session, if no user id, return unauthorized error
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the course in the databse where the course id and user id match, if no course found, return unauthorized error
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });
    if (!course) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { studentId, studentName, title, review, rating } = await req.json();

    const courseReview = await db.studentCourseReview.create({
      data: {
        studentId,
        studentName,
        title,
        review,
        rating,
        courseId: params.courseId,
      },
    });

    return NextResponse.json(courseReview);
  } catch (error) {
    console.log("[COURSE_ID_REVIEW]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
