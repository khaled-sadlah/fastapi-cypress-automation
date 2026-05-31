import { loginSelectors } from "../selectors/login.selectors";

export class LoginPage {
  visit() { cy.visit("/login"); }
  typeEmail(email: string) { cy.get(loginSelectors.emailInput).clear().type(email); }
  typePassword(password: string) { cy.get(loginSelectors.passwordInput).clear().type(password); }
  submit() { cy.contains('button, [role="button"]', /log in|login|sign in/i).click(); }
  login(email: string, password: string) { this.visit(); this.typeEmail(email); this.typePassword(password); this.submit(); }
  assertLoginPageVisible() { cy.get(loginSelectors.emailInput).should("be.visible"); cy.get(loginSelectors.passwordInput).should("be.visible"); }
  assertErrorVisible() { cy.contains(loginSelectors.errorText).should("be.visible"); }
  goToSignup() { cy.contains('a, button', loginSelectors.signupLinkText).click(); }
}
