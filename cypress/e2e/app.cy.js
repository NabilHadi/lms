describe("The Home Page", () => {
  beforeEach(() => {
    cy.session("signed-in", () => {
      cy.signIn();
    });
  });

  it("successfully loads Dashboard page", () => {
    cy.visit("/", { failOnStatusCode: false });

    cy.get(`[data-test="dashboard-page"]`).should("exist");

    // Check if sidebar exists
    cy.get(`[data-id-test="sidebar"]`).should("exist");

    // Check if the dashboard button exists
    cy.get('[data-test="Dashboard-button"]').should("exist");

    // Check if the browse button exists
    cy.get('[data-test="Browse-button"]').should("exist");
  });

  it("successfully loads Browse courses page", () => {
    cy.visit("/search", { failOnStatusCode: false });

    cy.url().should("include", "/search");

    cy.get('input[placeholder="Search for a course"]').should("exist");
  });

  it("loads categories in search page", () => {
    cy.visit("/search", { failOnStatusCode: false });

    cy.url().should("include", "/search");

    cy.get('[data-test="catogries-container"]').should("exist");
  });
});
