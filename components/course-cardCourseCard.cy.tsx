import React from "react";
import CourseCard from "./course-card";

describe("<CourseCard />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <CourseCard
        category="testCatgory"
        chaptersLength={2}
        id="test-id"
        imageUrl="test-url"
        progress={20}
        title="test-title"
      />
    );
  });
});
