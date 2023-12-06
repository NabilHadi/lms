const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

const { faker } = require("@faker-js/faker");

const reviewTitles = [
  // Positive review titles
  "Fantastic Course!",
  "Loved This Course!",
  "Excellent Lessons!",

  // Negative review titles
  "Disappointing Course",
  "Did Not Meet Expectations",
  "Would Not Recommend",

  // Neutral review titles
  "Decent Course",
  "Course Was Okay",
  "Satisfactory Course",
];

const reviews = [
  // Positive reviews
  "This course was fantastic! The instructor was knowledgeable and the material was presented clearly and effectively.",
  "I loved this course! The content was relevant and up-to-date. I would highly recommend it to others.",
  "Excellent course! The lessons were engaging and I learned a lot. Looking forward to more courses like this.",

  // Negative reviews
  "I was disappointed with this course. The material was outdated and the instructor was not very engaging.",
  "This course did not meet my expectations. The content was too basic and did not cover the topics in depth.",
  "I would not recommend this course. The lessons were disorganized and hard to follow.",

  // Neutral reviews
  "This course was okay. The content was good, but the lessons could have been more engaging.",
  "The course was decent. Some lessons were great, while others could use improvement.",
  "The course was satisfactory. It covered the basics well, but I wish it went more in-depth on some topics.",
];

async function main() {
  try {
    let data = [];
    for (let i = 0; i < 50; i++) {
      const reviewRandomNumber = faker.number.int({
        min: 0,
        max: 8,
      });
      let rating;
      if (reviewRandomNumber < 3) {
        rating = 5;
      } else if (reviewRandomNumber < 6) {
        rating = 1;
      } else {
        rating = 3;
      }

      data.push({
        id: faker.string.uuid(),
        studentId: "user_2WTIbPxURYKHPtC28NYwaU654Lg",
        courseId: "ea6fe9a9-4781-4d59-8d2e-a476bf2b9e3b",
        rating: rating,
        title: reviewTitles[reviewRandomNumber],
        review: reviews[reviewRandomNumber],
        studentName: faker.person.fullName(),
        createdAt: faker.date.between({
          from: "2023-01-01",
          to: "2023-12-31",
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
