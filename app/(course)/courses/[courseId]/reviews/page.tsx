import { getCourseReviews } from "@/actions/get-course-reviews";
import { auth } from "@clerk/nextjs";
import { Rating } from "@smastrom/react-rating";
import { redirect } from "next/navigation";

const getRatingCalculated = (
  reviews: {
    score: number | undefined;
    createdAt: string;
    id: string;
    studentId: string;
    courseId: string;
    rating: number;
    title: string;
    review: string;
    studentName: string;
    updatedAt: Date;
  }[]
) => {
  const totalRating = reviews.reduce((acc, review) => {
    return acc + review.rating;
  }, 0);
  const averageRating = (totalRating / reviews.length).toFixed(2);

  // calculate number of reviews per rating
  const fiveStarReviews = reviews.filter((review) => review.rating === 5);
  const fourStarReviews = reviews.filter((review) => review.rating === 4);
  const threeStarReviews = reviews.filter((review) => review.rating === 3);
  const twoStarReviews = reviews.filter((review) => review.rating === 2);
  const oneStarReviews = reviews.filter((review) => review.rating === 1);

  // Calculate percentage of reviews per rating
  const fiveStarPercentage = (
    (fiveStarReviews.length / reviews.length) *
    100
  ).toFixed(0);
  const fourStarPercentage = (
    (fourStarReviews.length / reviews.length) *
    100
  ).toFixed(0);
  const threeStarPercentage = (
    (threeStarReviews.length / reviews.length) *
    100
  ).toFixed(0);
  const twoStarPercentage = (
    (twoStarReviews.length / reviews.length) *
    100
  ).toFixed(0);
  const oneStarPercentage = (
    (oneStarReviews.length / reviews.length) *
    100
  ).toFixed(0);

  return {
    averageRating,
    oneStarReviews,
    twoStarReviews,
    threeStarReviews,
    fourStarReviews,
    fiveStarReviews,
    fiveStarPercentage,
    fourStarPercentage,
    threeStarPercentage,
    twoStarPercentage,
    oneStarPercentage,
  };
};

const CourseReviews = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const reviews = await getCourseReviews({
    courseId: params.courseId,
  });

  const {
    averageRating,
    oneStarReviews,
    twoStarReviews,
    threeStarReviews,
    fourStarReviews,
    fiveStarReviews,
    fiveStarPercentage,
    fourStarPercentage,
    threeStarPercentage,
    twoStarPercentage,
    oneStarPercentage,
  } = getRatingCalculated(reviews);

  return (
    <div className="p-4">
      <div className="grid grid-cols-[1fr_2fr] p-4 border-b-2">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-6xl font-bold mb-2">{averageRating}</h2>
          <Rating
            value={Number(averageRating)}
            readOnly
            style={{
              maxWidth: "6rem",
            }}
          />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {reviews.length} Total Ratings
          </p>
        </div>
        <div>
          <div className="flex items-center mt-4">
            <span className="text-sm font-medium text-gray-500">5 star</span>
            <div className="w-3/4 h-6 mx-4 bg-gray-200 rounded dark:bg-gray-700">
              <div
                className="h-6 bg-yellow-300 rounded"
                style={{
                  width: `${fiveStarPercentage}%`,
                }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {fiveStarPercentage}%
            </span>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-sm font-medium text-gray-500">4 star</span>
            <div className="w-3/4 h-6 mx-4 bg-gray-200 rounded dark:bg-gray-700">
              <div
                className="h-6 bg-yellow-300 rounded"
                style={{
                  width: `${fourStarPercentage}%`,
                }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {fourStarPercentage}%
            </span>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-sm font-medium text-gray-500">3 star</span>
            <div className="w-3/4 h-6 mx-4 bg-gray-200 rounded dark:bg-gray-700">
              <div
                className="h-6 bg-yellow-300 rounded"
                style={{
                  width: `${threeStarPercentage}%`,
                }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {threeStarPercentage}%
            </span>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-sm font-medium text-gray-500">2 star</span>
            <div className="w-3/4 h-6 mx-4 bg-gray-200 rounded dark:bg-gray-700">
              <div
                className="h-6 bg-yellow-300 rounded"
                style={{
                  width: `${twoStarPercentage}%`,
                }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {twoStarPercentage}%
            </span>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-sm font-medium text-gray-500">1 star</span>
            <div className="w-3/4 h-6 mx-4 bg-gray-200 rounded dark:bg-gray-700">
              <div
                className="h-6 bg-yellow-300 rounded"
                style={{
                  width: `${oneStarPercentage}%`,
                }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {oneStarPercentage}%
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        {reviews &&
          reviews.map((review) => (
            <div
              key={review.id}
              className="grid grid-cols-[1fr_2fr] items-center p-4 bg-gray-100 rounded mb-4"
            >
              <div className="flex flex-col items-center justify-center gap-1">
                <h3 className="font-semibold text-lg text-center">
                  {review.studentName}
                </h3>
                <Rating
                  value={review.rating}
                  readOnly
                  style={{
                    maxWidth: "6rem",
                  }}
                />
                <p className="text-sm font-medium text-gray-500">
                  {review.createdAt}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold">{review.title}</h3>
                <p className="">{review.review}</p>
              </div>
            </div>
          ))}
        {!reviews && (
          <div className="flex justify-center items-center h-64">
            <p>No reviews yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseReviews;
