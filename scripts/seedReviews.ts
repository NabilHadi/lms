const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

const { faker } = require("@faker-js/faker");

const reviews = [
  {
    title: "Fantastic Course!",
    review:
      "This course was fantastic! The instructor was knowledgeable and the material was presented clearly and effectively.",
    rating: 5,
    score: 0.4375,
  },
  {
    title: "Loved This Course!",
    review:
      "I loved this course! The content was relevant and up-to-date. I would highly recommend it to others.",
    rating: 5,
    score: 0.4375,
  },
  {
    title: "Excellent Lessons!",
    review:
      "Excellent course! The lessons were engaging and I learned a lot. Looking forward to more courses like this.",
    rating: 4,
    score: 0.4375,
  },
  {
    title: "Disappointing Course",
    review:
      "I was disappointed with this course. The material was outdated and the instructor was not very engaging.",
    rating: 1,
    score: -0.4375,
  },
  {
    title: "Did Not Meet Expectations",
    review:
      "This course did not meet my expectations. The content was too basic and did not cover the topics in depth.",
    rating: 2,
    score: -0.4375,
  },
  {
    title: "Would Not Recommend",
    review:
      "I would not recommend this course. The lessons were disorganized and hard to follow.",
    rating: 2,
    score: -0.4375,
  },
  {
    title: "Decent Course",
    review:
      "This course was okay. The content was good, but the lessons could have been more engaging.",
    rating: 3,
    score: 0,
  },
  {
    title: "Course Was Okay",
    review:
      "The course was decent. Some lessons were great, while others could use improvement.",
    rating: 3,
    score: 0,
  },
  {
    title: "Satisfactory Course",
    review:
      "The course was satisfactory. It covered the basics well, but I wish it went more in-depth on some topics.",
    rating: 3,
    score: 0,
  },
];

async function main() {
  try {
    let data = [];
    for (let i = 0; i < 50; i++) {
      const review = faker.helpers.arrayElement(reviews);

      data.push({
        id: faker.string.uuid(),
        studentId: "user_2WTIbPxURYKHPtC28NYwaU654Lg",
        courseId: "ea6fe9a9-4781-4d59-8d2e-a476bf2b9e3b",
        rating: review.rating,
        title: review.title,
        review: review.review,
        score: review.score,
        studentName: faker.person.fullName(),
        createdAt: faker.date.between({
          from: "2023-01-01",
          to: "2023-12-5",
        }),
        updatedAt: faker.date.recent(),
      });
    }

    await database.studentCourseReview.createMany({
      data: data,
    });

    console.log("Seeding finished.");
  } catch (error) {
    console.log("Errpr seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();
