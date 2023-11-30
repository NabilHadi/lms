"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface ViewCourseReviewsModalProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

const ViewCourseReviewsModal = ({
  trigger,
  children,
}: ViewCourseReviewsModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Course Reviews</DialogTitle>
          <DialogDescription>
            See what other students are saying about this course.
          </DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <DialogTrigger asChild>
            <Button>Close</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCourseReviewsModal;
