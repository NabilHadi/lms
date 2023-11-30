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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Rating } from "@smastrom/react-rating";

interface CourseReviewModalProps {
  children: React.ReactNode;
  onConfirm: ({
    name,
    title,
    review,
    rating,
  }: {
    name: string;
    title: string;
    review: string;
    rating: number;
  }) => void;
}

const CourseReviewModal = ({ children, onConfirm }: CourseReviewModalProps) => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(4);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Course Review</DialogTitle>
          <DialogDescription>
            Please leave a review for this course. This will help us improve our
            courses.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Rating value={rating} onChange={setRating} />
          <div>
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Your name"
              className="col-span-3"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div>
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              placeholder="What is the title of your review?"
              required
              className="col-span-3"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>
          <div className="">
            <Label htmlFor="review">Review</Label>
            <textarea
              id="review"
              placeholder="What do you think about this course?"
              className="w-full h-32 p-2 border border-gray-300 rounded-md"
              required
              onChange={(e) => setReview(e.target.value)}
              value={review}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button
              type="submit"
              onClick={() => {
                onConfirm({ name, title, review, rating });
                setName("");
                setTitle("");
                setReview("");
              }}
            >
              Save changes
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CourseReviewModal;
