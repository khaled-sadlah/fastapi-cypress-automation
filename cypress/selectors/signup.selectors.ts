export const signupSelectors = {
  fullNameInput: 'input[name="full_name"], input[name="fullName"], input[name="name"]',
  emailInput: 'input[name="email"], input[type="email"]',
  passwordInput: 'input[name="password"], input[type="password"]',
  confirmPasswordInput: 'input[name="confirm_password"], input[name="confirmPassword"]',
  submitButtonText: /sign up|register|create account/i,
  loginLinkText: /log in|login|sign in/i
};
