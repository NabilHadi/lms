import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import Mux from "@mux/mux-node";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
);

export async function DELETE(
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
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });
    if (!course) {
      return new NextResponse("Not Found", { status: 404 });
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await Video.Assets.del(chapter.muxData.assetId);
      }
    }

    const deletedCourse = db.course.delete({
      where: {
        id: params.courseId,
      },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("[COURSE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    // Get the user id from the session, if no user id, return unauthorized error
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the Course Id from Url parameters
    const { courseId } = params;
    // Get the Course values from the request body
    const values = await req.json();

    // Update the course in the database with the new values
    const course = await db.course.update({
      where: { id: courseId, userId },
      data: { ...values },
    });

    return new NextResponse(JSON.stringify(course), { status: 200 });
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
