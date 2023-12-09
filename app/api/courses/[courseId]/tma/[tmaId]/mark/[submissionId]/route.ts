import { db } from "@/lib/db";
import { utapi } from "@/lib/uploadthingServer";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  {
    params,
  }: { params: { courseId: string; tmaId: string; submissionId: string } }
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

    const studentSubmission = await db.studentTMASubmission.findUnique({
      where: {
        id: params.submissionId,
      },
    });

    if (!studentSubmission) {
      return new NextResponse("NOT FOUND", { status: 404 });
    }

    const { name, url, size, key, grade } = await req.json();

    const markedFile = await db.tMAMarkedFile.create({
      data: {
        name,
        url,
        size,
        key,
        studentId: studentSubmission.studentId,
        studentTmaSumissionId: params.submissionId,
      },
    });

    await db.studentTMASubmission.update({
      where: {
        id: params.submissionId,
      },
      data: {
        grade: grade,
        isMarked: true,
      },
    });

    return NextResponse.json(markedFile);
  } catch (error) {
    console.log("TMA_ID", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: { params: { courseId: string; tmaId: string; submissionId: string } }
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

    const studentSubmission = await db.studentTMASubmission.findUnique({
      where: {
        id: params.submissionId,
      },
    });

    if (!studentSubmission) {
      return new NextResponse("NOT FOUND", { status: 404 });
    }

    // Delte the file from the uploadthing server

    await db.tMAMarkedFile.delete({
      where: {
        studentTmaSumissionId: params.submissionId,
      },
    });

    await db.studentTMASubmission.update({
      where: {
        id: params.submissionId,
      },
      data: {
        grade: null,
        isMarked: false,
      },
    });

    await utapi.deleteFiles(studentSubmission.key);

    return NextResponse.json({ message: "File deleted" });
  } catch (error) {
    console.log("TMA_ID", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
