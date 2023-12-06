"use client";

import ViewCourseReviewsModal from "@/components/modals/view-course-reviews-modal";
import { Button } from "@/components/ui/button";
import { StudentCourseReview } from "@prisma/client";
import { Rating } from "@smastrom/react-rating";

interface ViewCourseReviewsButtonProps {
  reviews: {
    id: string;
    studentName: string;
    title: string;
    review: string;
    rating: number;
    createdAt: String;
  }[];
}

const ViewCourseReviewsButton = ({ reviews }: ViewCourseReviewsButtonProps) => {
  return (
    <ViewCourseReviewsModal
      trigger={<Button className="w-full">Show Course Reviews</Button>}
    >
      {reviews ? (
        <div className="grid gap-4 py-4 overflow-y-scroll max-h-[40vh] scroll-smooth">
          {reviews.length === 0 && (
            <div className="flex justify-center items-center h-64">
              <p>No reviews yet.</p>
            </div>
          )}
          {reviews.length > 0 &&
            reviews.map((review) => (
              <div key={review.id} className="p-4 bg-gray-100 rounded">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {review.studentName}
                  </h3>
                  <Rating
                    value={review.rating}
                    readOnly
                    style={{
                      maxWidth: "6rem",
                    }}
                  />
                </div>

                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">{review.createdAt}</p>
                </div>
                <h4 className="mt-2">{review.title}</h4>
                <p className="text-gray-500">{review.review}</p>
              </div>
            ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p>No reviews yet.</p>
        </div>
      )}
    </ViewCourseReviewsModal>
  );
};

export default ViewCourseReviewsButton;
