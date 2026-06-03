import { defineConfig } from "cypress";

export default defineConfig({
  reporter: "mochawesome",

  reporterOptions: {
    reportDir: "cypress/reports/mocha",
    overwrite: false,
    html: false,
    json: true
  },

  e2e: {
    baseUrl: "http://localhost:5173",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.ts",

    video: true,
    screenshotOnRunFailure: true,

    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,

    env: {
      apiUrl: "http://localhost:8000/api/v1",
      userEmail: "khalid.sadlah@gmail.com",
      userPassword: "12345678",
      userName: "khalid"
    }
  }
});