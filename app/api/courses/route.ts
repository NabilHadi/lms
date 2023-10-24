import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Get the user id from the session, if no user id, return unauthorized error
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the Course title from the request body
    const { title } = await req.json();

    // Create the course in the database
    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });

    return new NextResponse(JSON.stringify(course), { status: 201 });
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
