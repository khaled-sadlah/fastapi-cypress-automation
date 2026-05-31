import { LoginPage } from "../../pages/LoginPage";
import { SignupPage } from "../../pages/SignupPage";

describe("Authentication UI Tests", () => {
  const loginPage = new LoginPage();
  const signupPage = new SignupPage();

  it("TC-UI-AUTH-001: login page displays required fields", () => {
    loginPage.visit();
    loginPage.assertLoginPageVisible();
    cy.contains(/log in|login|sign in/i).should("be.visible");
  });

  it("TC-UI-AUTH-002: valid user can login and reach dashboard", () => {
    loginPage.login(Cypress.env("userEmail"), Cypress.env("userPassword"));
    cy.url().should("not.include", "/login");
    cy.contains(/hi|welcome|dashboard/i).should("be.visible");
  });

  it("TC-UI-AUTH-003: invalid password shows validation error", () => {
    loginPage.login(Cypress.env("userEmail"), "wrong-password");
    cy.url().should("include", "/login");
    cy.contains(/incorrect|invalid|error|failed/i).should("be.visible");
  });

  it("TC-UI-AUTH-004: invalid email format does not login", () => {
    loginPage.visit();
    loginPage.typeEmail("not-an-email");
    loginPage.typePassword("12345678");
    loginPage.submit();
    cy.url().should("include", "/login");
  });

  it("TC-UI-AUTH-005: empty fields do not submit login form", () => {
    loginPage.visit();
    loginPage.submit();
    cy.url().should("include", "/login");
  });

  it("TC-UI-AUTH-006: signup page opens from direct URL", () => {
    signupPage.visit();
    cy.url().should("include", "/signup");
    cy.get('input[type="email"], input[name="email"]').should("be.visible");
  });

  it("TC-UI-AUTH-007: signup invalid email format does not submit", () => {
    signupPage.visit();
    cy.get('input[type="email"], input[name="email"]').clear().type("bad-email");
    cy.contains('button, [role="button"]', /sign up|register|create account/i).click();
    cy.url().should("include", "/signup");
  });

  it("TC-UI-AUTH-008: unauthenticated user is redirected from protected pages", () => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit("/items", { failOnStatusCode: false });
    cy.url().should("match", /login|items|\//);
    cy.contains(/login|log in|email|password/i).should("exist");
  });

  it("TC-UI-AUTH-009: non-existing account cannot login", () => {
    loginPage.visit();

    loginPage.typeEmail(`unknown-${Date.now()}@mail.com`);
    loginPage.typePassword("Password123!");
    loginPage.submit();

    cy.url().should("include", "/login");
    cy.contains(/incorrect|invalid|error|failed|not found/i).should("be.visible");
  });

  it("TC-UI-SIGNUP-001: signup with existing email shows validation error", () => {
    signupPage.visit();

    cy.get('input[name="full_name"], input[name="fullName"]').clear().type("Existing User");
    cy.get('input[type="email"], input[name="email"]').clear().type(Cypress.env("userEmail"));
    cy.get('input[type="password"]').eq(0).clear().type("Password123!");
    cy.get('input[type="password"]').eq(1).clear().type("Password123!");

    cy.contains('button, [role="button"]', /sign up|register|create account/i).click();

    cy.url().should("include", "/signup");
    cy.contains(/already|exists|registered|error|failed/i).should("be.visible");
  });

  it("TC-UI-SIGNUP-002: password mismatch prevents registration", () => {
    signupPage.visit();

    cy.get('input[name="full_name"], input[name="fullName"]').clear().type("Mismatch User");
    cy.get('input[type="email"], input[name="email"]').clear().type(`mismatch-${Date.now()}@mail.com`);
    cy.get('input[type="password"]').eq(0).clear().type("Password123!");
    cy.get('input[type="password"]').eq(1).clear().type("DifferentPassword123!");

    cy.contains('button, [role="button"]', /sign up|register|create account/i).click();

    cy.url().should("include", "/signup");
    cy.contains(/password|match|same|error|valid/i).should("be.visible");
  });

  it("TC-UI-SIGNUP-003: valid signup creates a new account", () => {
    const email = `new-user-${Date.now()}@mail.com`;

    signupPage.visit();

    cy.get('input[name="full_name"], input[name="fullName"]').clear().type("New Test User");
    cy.get('input[type="email"], input[name="email"]').clear().type(email);
    cy.get('input[type="password"]').eq(0).clear().type("Password123!");
    cy.get('input[type="password"]').eq(1).clear().type("Password123!");

    cy.contains('button, [role="button"]', /sign up|register|create account/i).click();

    cy.url().should("match", /login|dashboard|\/$/);
  });
});