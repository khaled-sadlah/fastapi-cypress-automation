export const loginSelectors = {
  emailInput: 'input[name="email"], input[type="email"]',
  passwordInput: 'input[name="password"], input[type="password"]',
  loginButton: 'button:contains("Log In"), button:contains("Login"), button:contains("Sign in")',
  signupLinkText: /sign up|create account|register/i,
  errorText: /incorrect|invalid|error|failed/i
};
