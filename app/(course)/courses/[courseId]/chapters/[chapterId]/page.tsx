import { getChapter } from "@/actions/get-chapter";
import Banner from "@/components/banner";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import VideoPlayer from "./_components/video-player";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File, View } from "lucide-react";
import CourseProgressButton from "./_components/course-progress-button";
import StudentTMASubmissionForm from "./_components/student-tma-submission-form";
import { getStudentTMASubmission } from "@/actions/get-student-tma-submissions";
import CourseReviewButton from "./_components/course-review-button";
import ViewCourseReviewsButton from "./_components/view-course-reviews-button";
import { getCourseReviews } from "@/actions/get-course-reviews";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const { chapter, course, muxData, attachments, nextChapter, userProgress } =
    await getChapter({
      userId,
      chapterId: params.chapterId,
      courseId: params.courseId,
    });

  const { studentTMASubmission, tutorMarkedAssignments } =
    await getStudentTMASubmission({
      userId: userId,
      courseId: params.courseId,
    });

  const reviews = await getCourseReviews({
    courseId: params.courseId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  const completeOnEnd = !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          variant={"success"}
          label="You already completed this chapter"
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            <CourseProgressButton
              chapterId={params.chapterId}
              courseId={params.courseId}
              nextChapterId={nextChapter?.id}
              isCompleted={!!userProgress?.isCompleted}
            />
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!} />
          </div>
          {!!tutorMarkedAssignments.length && (
            <>
              <Separator />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">
                  Tutor Marked Assignments
                </h3>
                {tutorMarkedAssignments.map((assignment) => (
                  <div key={assignment.id}>
                    <a
                      href={assignment.url}
                      target="_blank"
                      className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                    >
                      <File />
                      <p className="line-clamp-1">{assignment.name}</p>
                    </a>
                    <StudentTMASubmissionForm
                      prevStudentTMASubmission={studentTMASubmission[0]}
                      tmaTitle={assignment.name.split(".")[0]}
                      courseId={course.id}
                      tmaId={assignment.id}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">
                  Course Attachments
                </h3>
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
          <Separator />
          {/* Course Review Button */}
          <div className="flex p-4 gap-4">
            <CourseReviewButton courseId={params.courseId} studentId={userId} />
            <ViewCourseReviewsButton reviews={reviews} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
