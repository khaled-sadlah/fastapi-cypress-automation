import { signupSelectors } from "../selectors/signup.selectors";

export class SignupPage {
  visit() { cy.visit("/signup"); }
  fill(fullName: string, email: string, password: string, confirmPassword?: string) {
    cy.get(signupSelectors.fullNameInput).clear().type(fullName);
    cy.get(signupSelectors.emailInput).clear().type(email);
    cy.get(signupSelectors.passwordInput).clear().type(password);
    cy.get("body").then(($body) => {
      if ($body.find(signupSelectors.confirmPasswordInput).length) {
        cy.get(signupSelectors.confirmPasswordInput).clear().type(confirmPassword || password);
      }
    });
  }
  submit() { cy.contains('button, [role="button"]', signupSelectors.submitButtonText).click(); }
  goToLogin() { cy.contains('a, button', signupSelectors.loginLinkText).click(); }
}
