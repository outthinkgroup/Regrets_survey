/// <reference types="cypress" />

context("homepage", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("it loads with correct Headline", () => {
    cy.get(".StyledComponents__PageIntro-ieaZBA h1").should(
      "have.text",
      "Welcome to the World Regret Survey"
    );
  });
  it("take survey button takes you to survey", () => {
    cy.get("header .SurveyButton__Button-kwClRE").click();
    cy.url().should(
      "eq",
      "https://worldregretsurvey.iad1.qualtrics.com/jfe/form/SV_3CRcRbjb7pIenxr"
    );
  });
});
