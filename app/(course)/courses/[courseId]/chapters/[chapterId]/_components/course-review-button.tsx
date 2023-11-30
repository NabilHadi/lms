"use client";

import CourseReviewModal from "@/components/modals/course-review-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";

interface CourseReviewButtonProps {
  courseId: string;
  studentId: string;
}

const CourseReviewButton = ({
  courseId,
  studentId,
}: CourseReviewButtonProps) => {
  const onConfirm = async ({
    name,
    title,
    review,
    rating,
  }: {
    name: string;
    title: string;
    review: string;
    rating: number;
  }) => {
    try {
      await axios.post(`/api/courses/${courseId}/reviews`, {
        studentId: studentId,
        studentName: name,
        title,
        review,
        rating,
      });
      console.log("Review submitted successfully", {
        name,
        title,
        review,
        rating,
      });

      toast.success("Review submitted successfully");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <CourseReviewModal onConfirm={onConfirm}>
      <Button className="w-full">Review Course</Button>
    </CourseReviewModal>
  );
};

export default CourseReviewButton;
