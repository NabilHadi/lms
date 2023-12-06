import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { PorterStemmer, SentimentAnalyzer, WordTokenizer } from "natural";
import { removeStopwords } from "stopword";

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

    const { studentId, studentName, title, review, rating } = await req.json();

    /**
     * Removing non alphabetical and special characters
     * Converting to lowercase
     */
    const alphaOnlyReview = review.replace(/[^a-zA-Z\s]+/g, "");

    /**
     * Tokenization
     */
    const tokenizer = new WordTokenizer();
    const tokenizedText = tokenizer.tokenize(alphaOnlyReview) || [];

    /** Remove stop words */
    const filteredText = removeStopwords(tokenizedText);
    const analyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");

    const score = analyzer.getSentiment(filteredText);

    const courseReview = await db.studentCourseReview.create({
      data: {
        studentId,
        studentName,
        title,
        review,
        rating,
        score,
        courseId: params.courseId,
      },
    });

    return NextResponse.json(courseReview);
  } catch (error) {
    console.log("[COURSE_ID_REVIEW]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
