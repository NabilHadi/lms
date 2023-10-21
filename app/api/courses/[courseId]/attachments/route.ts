import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    // check if the user is logged in
    const { userId } = auth();

    // if the user is not logged in, return unauthorized error
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // check if the person who is trying to add the attachment is the owner of the course
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

    // Get the attachment url from the request body
    const { url } = await req.json();

    // create the attachment in the database
    const attachment = await db.attachment.create({
      data: {
        url: url,
        name: url.split("/").pop(),
        courseId: params.courseId,
      },
    });

    // return the attachment
    return NextResponse.json(attachment);
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
