import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { PorterStemmer, SentimentAnalyzer, WordTokenizer } from "natural";
import { removeStopwords } from "stopword";

// The Porter Stemmer is an algorithm used for stemming in natural language processing. Stemming is the process of reducing words to their base or root form. For instance, the words "fishing," "fished," and "fisher" would all be reduced to the stem "fish."
// The primary goal of stemming, and hence the use of the Porter Stemmer, is to reduce the complexity of text data and improve the performance of text processing in tasks like search, data retrieval, and text mining. By converting words to their root forms, it helps in standardizing words with similar meanings, thereby making it easier to analyze and process text.

// The Sentiment analysis algorithm based on a vocabulary that assigns polarity to words. The algorithm calculates the sentiment of a piece of text by summing the polarity of each word and normalizing with the length of the sentence. If a negation occurs the result is made negative.

// WordTokenizer splits on punctuation, and keeps punctuation as separate tokens. Contractions are split apart (e.g. "can't" becomes "ca" and "n't"). Additionally, the tokenizer removes punctuation from words (e.g. "end." becomes "end"). The tokenizer also removes single quotes from words (e.g. "Bill's" becomes "Bill"). Finally, the tokenizer removes empty tokens after splitting (e.g. "  " becomes "").

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

    // Stop words are the words in a stop list which are filtered out before or after processing of natural language data because they are insignificant. Usually, these are extremely common words that would appear to be of little value in helping process natural language.
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
