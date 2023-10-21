import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; attachmentId: string } }
) {
  try {
    // check if the user is logged in
    const { userId } = auth();

    // if the user is not logged in, return unauthorized error
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // check if the person who is trying to delete the attachment is the owner of the course
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    // if the person is not the owner of the course, return unauthorized error
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // delete the attachment from the database
    const attachment = await db.attachment.delete({
      where: {
        courseId: params.courseId,
        id: params.attachmentId,
      },
    });

    // return success message
    return NextResponse.json(attachment);
  } catch (error) {
    console.log("ATTACHMENT_ID", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
