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

    // Get the TMA properties from the request body
    const { url, name, key, size, totalGrade } = await req.json();

    // Add the tma to the database
    const tma = await db.tutorMarkAssignment.create({
      data: {
        url: url,
        key: key,
        size: size + "",
        name: name ?? url.split("/").pop(),
        courseId: params.courseId,
        totalGrade: totalGrade,
      },
    });

    return NextResponse.json(tma);
  } catch (error) {
    console.log("[COURSE_ID_TMA]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
