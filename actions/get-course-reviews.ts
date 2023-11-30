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

    return courseReviews;
  } catch (error) {
    console.log("[GET_COURSE_REVIEWS]", error);
    return [];
  }
};
