/// <reference types="cypress" />

const { symbol } = require("prop-types");

context("map", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("loads", () => {
    cy.get("svg.map").should(
      "include.html",
      '<path data-country="polygon4617" id="polygon4617" d="M250.89,91v1.16l-1.16-2.46.73-.15,2.31.44Z"></path>'
    );
  });

  it("countries with regrets are interactive", () => {
    //zoom works
    cy.get("[data-country][data-hasentries]")
      .first()
      .click();
    cy.get("svg.map").should("not.have.attr", "viewBox", "0 0 1024 561.64917");

    //regret pops up
    cy.get(".active-state-info-card").should("exist");

    //see Another
    const button = cy.get(".active-state-info-card button.next");
    button.click();
    button.should("exist");

    //zoomout works
    cy.get(".zoomout").click();
    cy.get("svg.map").should("have.attr", "viewBox", "0 0 1024 561.64917");

    //close button works
    cy.get("[data-country][data-hasentries]")
      .first()
      .click();
    cy.get(".active-state-info-card button.close").click();
    cy.get("svg.map").should("have.attr", "viewBox", "0 0 1024 561.64917");

    //CHECKING PARENT_COUNTRY/STATE FUNCTIONALITY
    cy.get("#United_States [data-hasentries]")
      .first()
      .click();
    cy.get("svg.map").should("not.have.attr", "viewBox", "0 0 1024 561.64917");

    //State View Works
    cy.get("#United_States [data-hasentries]")
      .first()
      .click();
    cy.get(".active-state-info-card").should("exist");
    cy.get(".zoomout").click();
    cy.get("svg.map").should("not.have.attr", "viewBox", "0 0 1024 561.64917");
  });

  it("searchBox Works", () => {
    const searchBox = cy.get(".CountrySearch__SearchBar-fIuJUf");
    searchBox.should("exist");
    searchBox.type("virginia").should("have.value", "virginia");
    const list = cy.get(".CountrySearch___default-fVasUo ul");
    list.should("exist");
    const searchButton = cy.get(
      '.CountrySearch___default-fVasUo button[type="submit"]'
    );
    searchButton.should("exist");

    searchButton.click();
    cy.get(".active-state-info-card").should("exist");

    cy.get(".zoomout").click();
    cy.get(".CountrySearch__SearchBar-fIuJUf").type("Virgin");
    cy.get(".CountrySearch___default-fVasUo li")
      .first()
      .should("contain.text", "Virginia");

    cy.get(".CountrySearch__SearchBar-fIuJUf")
      .type("{selectall}{backspace}")
      .type("Virg", { delay: 200 });
    cy.get(".CountrySearch___default-fVasUo li")
      .first()
      .click();
    cy.get('.CountrySearch___default-fVasUo button[type="submit"]').click();
    cy.get(".active-state-info-card").should("exist");
    cy.get(".active-state-info-card .close").click();

    cy.get(".CountrySearch__SearchBar-fIuJUf")
      .type("Iceland{enter}{enter}")
      .wait(200);
    cy.get(".Notifications__StyledNotification-gUaUly")
      .should("exist")
      .contains("No entries yet");
  });
});
