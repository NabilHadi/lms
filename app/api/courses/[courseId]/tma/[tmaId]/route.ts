import { db } from "@/lib/db";
import { utapi } from "@/lib/uploadthingServer";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; tmaId: string } }
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

    // delete the TMA from the database
    const tutorMarkAssignment = await db.tutorMarkAssignment.delete({
      where: {
        courseId: params.courseId,
        id: params.tmaId,
      },
    });

    await utapi.deleteFiles(tutorMarkAssignment.key);

    return NextResponse.json(tutorMarkAssignment);
  } catch (error) {
    console.log("TMA_ID", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
