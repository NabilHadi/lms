import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(
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

    const { list } = await req.json();

    for (let item of list) {
      await db.chapter.update({
        where: {
          id: item.id,
        },
        data: {
          position: item.position,
        },
      });
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("[REPORDER]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
