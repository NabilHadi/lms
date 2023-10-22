import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

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

    // Get the title from the request body
    const { title } = await req.json();

    // find the last chapter in the course to get the position of the new chapter to be created (lastChapter.position + 1) or 1 if there are no chapters in the course yet
    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    // create the attachment in the database
    const chapter = await db.chapter.create({
      data: {
        title,
        courseId: params.courseId,
        position: newPosition,
      },
    });

    // return the chapter
    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTERS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
