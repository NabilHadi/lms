import { db } from "@/lib/db";

import { PorterStemmer, SentimentAnalyzer, WordTokenizer } from "natural";
import { removeStopwords } from "stopword";

type MonthData = {
  month: string;
  monthNumber: number;
  numberOfReviews: number;
  numberOfNegativeReviews: number;
  numberOfPositiveReviews: number;
  numberOfNeutralReviews: number;
  averageRating: number;
};

type YearData = MonthData[];

export const getAnalytics = async (teacherId: string): Promise<YearData> => {
  try {
    const reviews = await db.studentCourseReview.findMany({
      where: {
        course: {
          userId: teacherId,
        },
      },
      include: {
        course: true,
      },
    });

    const reviewsSentiment = reviews.map((item) => {
      /**
       * Removing non alphabetical and special characters
       * Converting to lowercase
       */
      const alphaOnlyReview = item.review.replace(/[^a-zA-Z\s]+/g, "");

      /**
       * Tokenization
       */
      const tokenizer = new WordTokenizer();
      const tokenizedText = tokenizer.tokenize(alphaOnlyReview) || [];

      /** Remove stop words */
      const filteredText = removeStopwords(tokenizedText);

      const analyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");
      const score = analyzer.getSentiment(filteredText);

      let emotion = "";

      if (score > 0.5) {
        emotion = "Very positive";
      } else if (score > 0) {
        emotion = "Positive";
      } else if (score < -0.5) {
        emotion = "Very negative";
      } else if (score < 0) {
        emotion = "Negative";
      } else {
        emotion = "Neutral";
      }

      return {
        ...item,
        score,
        emotion,
      };
    });

    const yearData: YearData = [];

    const currentYear = new Date().getFullYear();

    for (let i = 0; i < 12; i++) {
      const monthNumber = i + 1;
      const month = new Date(currentYear, i).toLocaleString("default", {
        month: "long",
      });

      const monthData: MonthData = {
        month,
        monthNumber,
        numberOfReviews: 0,
        numberOfNegativeReviews: 0,
        numberOfPositiveReviews: 0,
        numberOfNeutralReviews: 0,
        averageRating: 0,
      };

      reviewsSentiment.forEach((review) => {
        const reviewMonth = new Date(review.createdAt).getMonth() + 1;
        const reviewYear = new Date(review.createdAt).getFullYear();

        if (reviewMonth === monthNumber && reviewYear === currentYear) {
          monthData.numberOfReviews += 1;
          monthData.averageRating += review.rating;

          if (review.score < 0) {
            monthData.numberOfNegativeReviews += 1;
          } else if (review.score > 0) {
            monthData.numberOfPositiveReviews += 1;
          } else {
            monthData.numberOfNeutralReviews += 1;
          }
        }
      });

      if (monthData.numberOfReviews > 0) {
        monthData.averageRating /= monthData.numberOfReviews;
      }

      yearData.push(monthData);
    }

    return yearData;
  } catch (error) {
    console.error("[GET_ANALYTICS_ERROR]", error);
    return [];
  }
};
