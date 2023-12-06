"use client";

import CourseReviewModal from "@/components/modals/course-review-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseReviewButtonProps {
  courseId: string;
  studentId: string;
}

const CourseReviewButton = ({
  courseId,
  studentId,
}: CourseReviewButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
      setIsLoading(true);
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
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CourseReviewModal onConfirm={onConfirm}>
      <Button className="w-full bg-sky-800" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit Review"}
      </Button>
    </CourseReviewModal>
  );
};

export default CourseReviewButton;
