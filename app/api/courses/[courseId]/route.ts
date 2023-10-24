import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { NextResponse } from "next/server";

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
