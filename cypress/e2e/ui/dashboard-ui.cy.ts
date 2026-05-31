import { DashboardPage } from "../../pages/DashboardPage";

describe("Dashboard UI Tests", () => {
  const dashboardPage = new DashboardPage();

  beforeEach(() => {
    cy.uiLogin();
  });

  it("TC-UI-DASH-001: dashboard loads after login", () => {
    dashboardPage.assertLoaded();
  });

  it("TC-UI-DASH-002: username or welcome text is displayed", () => {
    cy.contains(new RegExp(Cypress.env("userName") + "|hi|welcome", "i")).should("be.visible");
  });

  it("TC-UI-DASH-003: sidebar or navigation options are visible", () => {
    dashboardPage.assertSidebarVisible();
  });

  it("TC-UI-DASH-004: user can navigate to Items page", () => {
    dashboardPage.goToItems();
    cy.url().should("include", "/items");
    cy.contains(/items/i).should("be.visible");
  });

  it("TC-UI-DASH-005: user information appears somewhere in the logged-in area", () => {
    cy.contains(new RegExp(Cypress.env("userEmail") + "|" + Cypress.env("userName"), "i")).should("exist");
  });
});
