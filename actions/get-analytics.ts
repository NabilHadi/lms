import { db } from "@/lib/db";

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
    // TODO: ADD SENTIMENT ANALYSIS TO REVIEWS IN DATABASE

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

      reviews.forEach((review) => {
        if (review.score === null) {
          console.log("score is null", { review });
          return;
        }
        const reviewMonth = new Date(review.createdAt).getMonth() + 1;
        const reviewYear = new Date(review.createdAt).getFullYear();

        if (reviewMonth === monthNumber && reviewYear === currentYear) {
          monthData.numberOfReviews += 1;
          monthData.averageRating += review.rating;

          if (review.score.comparedTo(0) < 0) {
            monthData.numberOfNegativeReviews += 1;
          } else if (review.score.comparedTo(0) > 0) {
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
