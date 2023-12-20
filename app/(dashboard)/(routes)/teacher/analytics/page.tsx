import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getAnalytics, getAnalyticsForCourse } from "@/actions/get-analytics";

import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";
import { db } from "@/lib/db";

const AnalyticsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const yearAnalytics = await getAnalytics(userId);

  let totalPositiveReviews = yearAnalytics.reduce(
    (total, monthData) => total + monthData.numberOfPositiveReviews,
    0
  );
  let totalNeutralReviews = yearAnalytics.reduce(
    (total, monthData) => total + monthData.numberOfNeutralReviews,
    0
  );
  let totalNegativeReviews = yearAnalytics.reduce(
    (total, monthData) => total + monthData.numberOfNegativeReviews,
    0
  );

  const courses = await db.course.findMany({
    where: {
      userId: userId,
    },
  });

  const coursesWithYearAnalytics = await Promise.all(
    courses.map(async (course) => {
      const courseAnalytics = await getAnalyticsForCourse(course.id);
      const totalReviews = courseAnalytics.reduce((prev, next) => {
        return prev + next.numberOfReviews;
      }, 0);
      const totalPositiveReviews = courseAnalytics.reduce((prev, next) => {
        return prev + next.numberOfPositiveReviews;
      }, 0);
      const totalNeutralReviews = courseAnalytics.reduce((prev, next) => {
        return prev + next.numberOfNeutralReviews;
      }, 0);
      const totalNegativeReviews = courseAnalytics.reduce((prev, next) => {
        return prev + next.numberOfNegativeReviews;
      }, 0);
      return {
        ...course,
        analytics: {
          totalReviews,
          totalPositiveReviews,
          totalNeutralReviews,
          totalNegativeReviews,
          yearAnalytics: courseAnalytics,
        },
      };
    })
  );

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <DataCard
          label="Total Positive Reviews"
          value={totalPositiveReviews}
          variant="positive"
        />
        <DataCard
          label="Total Neutral Reviews"
          value={totalNeutralReviews}
          variant="neutral"
        />
        <DataCard
          label="Total Negative Reviews"
          value={totalNegativeReviews}
          variant="negative"
        />
      </div>
      <Chart
        data={[
          {
            name: "Jan",
            totalPositiveReviews: yearAnalytics[0].numberOfPositiveReviews,
            totalNeutralReviews: yearAnalytics[0].numberOfNeutralReviews,
            totalNegativeReviews: yearAnalytics[0].numberOfNegativeReviews,
          },
          {
            name: "Feb",
            totalPositiveReviews: yearAnalytics[1].numberOfPositiveReviews,
            totalNeutralReviews: yearAnalytics[1].numberOfNeutralReviews,
            totalNegativeReviews: yearAnalytics[1].numberOfNegativeReviews,
          },
          {
            name: "Mar",
            totalPositiveReviews: yearAnalytics[2].numberOfPositiveReviews,
            totalNeutralReviews: yearAnalytics[2].numberOfNeutralReviews,
            totalNegativeReviews: yearAnalytics[2].numberOfNegativeReviews,
          },
          {
            name: "Apr",
            totalPositiveReviews: yearAnalytics[3].numberOfPositiveReviews,
            totalNeutralReviews: yearAnalytics[3].numberOfNeutralReviews,
            totalNegativeReviews: yearAnalytics[3].numberOfNegativeReviews,
          },
          {
            name: "May",
            totalPositiveReviews: yearAnalytics[4].numberOfPositiveReviews,
            totalNeutralReviews: yearAnalytics[4].numberOfNeutralReviews,
            totalNegativeReviews: yearAnalytics[4].numberOfNegativeReviews,
          },
          {
            name: "Jun",
            totalPositiveReviews: yearAnalytics[5].numberOfPositiveReviews,
            totalNeutralReviews: yearAnalytics[5].numberOfNeutralReviews,
            totalNegativeReviews: yearAnalytics[5].numberOfNegativeReviews,
          },
          {
            name: "Jul",
            totalPositiveReviews: yearAnalytics[6].numberOfPositiveReviews,
            totalNeutralReviews: yearAnalytics[6].numberOfNeutralReviews,
            totalNegativeReviews: yearAnalytics[6].numberOfNegativeReviews,
          },
          {
            name: "Aug",
            totalPositiveReviews: yearAnalytics[7].numberOfPositiveReviews,
            totalNeutralReviews: yearAnalytics[7].numberOfNeutralReviews,
            totalNegativeReviews: yearAnalytics[7].numberOfNegativeReviews,
          },
          {
            name: "Sep",
            totalPositiveReviews: yearAnalytics[8].numberOfPositiveReviews,
            totalNeutralReviews: yearAnalytics[8].numberOfNeutralReviews,
            totalNegativeReviews: yearAnalytics[8].numberOfNegativeReviews,
          },
          {
            name: "Oct",
            totalPositiveReviews: yearAnalytics[9].numberOfPositiveReviews,
            totalNeutralReviews: yearAnalytics[9].numberOfNeutralReviews,
            totalNegativeReviews: yearAnalytics[9].numberOfNegativeReviews,
          },
          {
            name: "Nov",
            totalPositiveReviews: yearAnalytics[10].numberOfPositiveReviews,
            totalNeutralReviews: yearAnalytics[10].numberOfNeutralReviews,
            totalNegativeReviews: yearAnalytics[10].numberOfNegativeReviews,
          },
          {
            name: "Dec",
            totalPositiveReviews: yearAnalytics[11].numberOfPositiveReviews,
            totalNeutralReviews: yearAnalytics[11].numberOfNeutralReviews,
            totalNegativeReviews: yearAnalytics[11].numberOfNegativeReviews,
          },
        ]}
      />
      {/* Reviews per course */}
      <div className="border mt-2 rounded">
        <div className="border-b p-4">
          <h3 className="text-xl font-bold">Reviews per course</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4">
          {coursesWithYearAnalytics.map((course) => (
            <div
              key={course.id}
              className="flex flex-col bg-white shadow-lg rounded p-4"
            >
              <h4 className="text-lg font-bold mb-2">{course.title}</h4>
              <div className="flex items-center mb-2">
                <div className="bg-green-500 w-2 h-2 rounded-full mr-2"></div>
                <p className="text-sm">
                  {course.analytics.totalPositiveReviews} Positve Reviews
                </p>
              </div>
              <div className="flex items-center mb-2">
                <div className="bg-yellow-500 w-2 h-2 rounded-full mr-2"></div>
                <p className="text-sm">
                  {course.analytics.totalNeutralReviews} Neutral Reviews
                </p>
              </div>
              <div className="flex items-center mb-2">
                <div className="bg-red-500 w-2 h-2 rounded-full mr-2"></div>
                <p className="text-sm">
                  {course.analytics.totalNegativeReviews} Negative Reviews
                </p>
              </div>
              <Chart
                data={[
                  {
                    name: "Jan",
                    totalPositiveReviews:
                      course.analytics.yearAnalytics[0].numberOfPositiveReviews,
                    totalNeutralReviews:
                      course.analytics.yearAnalytics[0].numberOfNeutralReviews,
                    totalNegativeReviews:
                      course.analytics.yearAnalytics[0].numberOfNegativeReviews,
                  },
                  {
                    name: "Feb",
                    totalPositiveReviews:
                      course.analytics.yearAnalytics[1].numberOfPositiveReviews,
                    totalNeutralReviews:
                      course.analytics.yearAnalytics[1].numberOfNeutralReviews,
                    totalNegativeReviews:
                      course.analytics.yearAnalytics[1].numberOfNegativeReviews,
                  },
                  {
                    name: "Mar",
                    totalPositiveReviews:
                      course.analytics.yearAnalytics[2].numberOfPositiveReviews,
                    totalNeutralReviews:
                      course.analytics.yearAnalytics[2].numberOfNeutralReviews,
                    totalNegativeReviews:
                      course.analytics.yearAnalytics[2].numberOfNegativeReviews,
                  },
                  {
                    name: "Apr",
                    totalPositiveReviews:
                      course.analytics.yearAnalytics[3].numberOfPositiveReviews,
                    totalNeutralReviews:
                      course.analytics.yearAnalytics[3].numberOfNeutralReviews,
                    totalNegativeReviews:
                      course.analytics.yearAnalytics[3].numberOfNegativeReviews,
                  },
                  {
                    name: "May",
                    totalPositiveReviews:
                      course.analytics.yearAnalytics[4].numberOfPositiveReviews,
                    totalNeutralReviews:
                      course.analytics.yearAnalytics[4].numberOfNeutralReviews,
                    totalNegativeReviews:
                      course.analytics.yearAnalytics[4].numberOfNegativeReviews,
                  },
                  {
                    name: "Jun",
                    totalPositiveReviews:
                      course.analytics.yearAnalytics[5].numberOfPositiveReviews,
                    totalNeutralReviews:
                      course.analytics.yearAnalytics[5].numberOfNeutralReviews,
                    totalNegativeReviews:
                      course.analytics.yearAnalytics[5].numberOfNegativeReviews,
                  },
                  {
                    name: "Jul",
                    totalPositiveReviews:
                      course.analytics.yearAnalytics[6].numberOfPositiveReviews,
                    totalNeutralReviews:
                      course.analytics.yearAnalytics[6].numberOfNeutralReviews,
                    totalNegativeReviews:
                      course.analytics.yearAnalytics[6].numberOfNegativeReviews,
                  },
                  {
                    name: "Aug",
                    totalPositiveReviews:
                      course.analytics.yearAnalytics[7].numberOfPositiveReviews,
                    totalNeutralReviews:
                      course.analytics.yearAnalytics[7].numberOfNeutralReviews,
                    totalNegativeReviews:
                      course.analytics.yearAnalytics[7].numberOfNegativeReviews,
                  },
                  {
                    name: "Sep",
                    totalPositiveReviews:
                      course.analytics.yearAnalytics[8].numberOfPositiveReviews,
                    totalNeutralReviews:
                      course.analytics.yearAnalytics[8].numberOfNeutralReviews,
                    totalNegativeReviews:
                      course.analytics.yearAnalytics[8].numberOfNegativeReviews,
                  },
                  {
                    name: "Oct",
                    totalPositiveReviews:
                      course.analytics.yearAnalytics[9].numberOfPositiveReviews,
                    totalNeutralReviews:
                      course.analytics.yearAnalytics[9].numberOfNeutralReviews,
                    totalNegativeReviews:
                      course.analytics.yearAnalytics[9].numberOfNegativeReviews,
                  },
                  {
                    name: "Nov",
                    totalPositiveReviews:
                      course.analytics.yearAnalytics[10]
                        .numberOfPositiveReviews,
                    totalNeutralReviews:
                      course.analytics.yearAnalytics[10].numberOfNeutralReviews,
                    totalNegativeReviews:
                      course.analytics.yearAnalytics[10]
                        .numberOfNegativeReviews,
                  },
                  {
                    name: "Dec",
                    totalPositiveReviews:
                      course.analytics.yearAnalytics[11]
                        .numberOfPositiveReviews,
                    totalNeutralReviews:
                      course.analytics.yearAnalytics[11].numberOfNeutralReviews,
                    totalNegativeReviews:
                      course.analytics.yearAnalytics[11]
                        .numberOfNegativeReviews,
                  },
                ]}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
