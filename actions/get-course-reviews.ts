import { db } from "@/lib/db";

interface GetCourseReviewsProps {
  courseId: string;
}

export const getCourseReviews = async ({ courseId }: GetCourseReviewsProps) => {
  try {
    const courseReviews = await db.studentCourseReview.findMany({
      where: {
        courseId: courseId,
      },
    });

    return courseReviews.map((review) => ({
      ...review,
      score: review.score?.toNumber(),
      createdAt: review.createdAt.toLocaleDateString(),
    }));
  } catch (error) {
    console.log("[GET_COURSE_REVIEWS]", error);
    return [];
  }
};
