import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getAnalytics } from "@/actions/get-analytics";

import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";

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
    </div>
  );
};

export default AnalyticsPage;

// const AnalyticsPage = () => {
//   return <div>AnalyticsPage</div>;
// };

// /**
//  * TODO IN PROJECT:
//  * 1- Add TMA feature
//  * 2- Add Review/Comments feature for students
//  * 3- Add Sentiment Analysis feature for Teachers
//  * 4- Add ability fro teach to download tma submissions and mark them
//  */

// export default AnalyticsPage;
