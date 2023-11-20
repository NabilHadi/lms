import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    // Get the user id from the session, if no user id, return unauthorized error
    const { userId: StudentUserId } = auth();
    if (!StudentUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the course in the databse where the course id match
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
    });
    if (!course) {
      return new NextResponse("Course Not Found", { status: 401 });
    }

    // Get the TMA properties from the request body
    const { url, name, key, size, tmaId } = await req.json();

    // Add the tma submission to the database
    const tmaSubmission = await db.studentTMASubmission.create({
      data: {
        url: url,
        key: key,
        size: size + "",
        name: name ?? url.split("/").pop(),
        courseId: params.courseId,
        studentId: StudentUserId,
        tmaId: tmaId,
      },
    });

    return NextResponse.json(tmaSubmission);
  } catch (error) {
    console.log("[STUDENT_COURSE_ID_TMA_SUBMISSION]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
