import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client";
import { getProgress } from "@/actions/get-progress";

type CourseWithProgressWithCategory = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
};

type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  coursesInProgress: any[];
};

export const getDashboardCourses = async (
  userId: string
): Promise<DashboardCourses> => {
  try {
    const userProgresses = await db.userProgress.findMany({
      where: {
        userId,
      },
      select: {
        chapter: {
          select: {
            course: {
              include: {
                category: true,
                chapters: true,
              },
            },
          },
        },
      },
    });

    const courses = userProgresses
      .filter((userProgress, index, array) => {
        return (
          array.findIndex(
            (item) => item.chapter.course.id === userProgress.chapter.course.id
          ) === index
        );
      })
      .map(
        (userProgresses) => userProgresses.chapter.course
      ) as CourseWithProgressWithCategory[];

    for (let course of courses) {
      const progress = await getProgress(userId, course.id);
      course.progress = progress;
    }

    const completedCourses = courses.filter(
      (course) => course.progress === 100
    );
    const coursesInProgress = courses.filter(
      (course) => (course.progress ?? 0) !== 100
    );

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.log("[GET_DASHBOARD_COURSES]", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};
