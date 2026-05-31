describe("Authentication API Tests - Strong Assertions", () => {
  const apiUrl = Cypress.env("apiUrl");

  it("TC-API-AUTH-001: login returns a valid token JSON body", () => {
    cy.request({
      method: "POST",
      url: `${apiUrl}/login/access-token`,
      form: true,
      body: { username: Cypress.env("userEmail"), password: Cypress.env("userPassword") }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.headers["content-type"]).to.include("application/json");
      expect(response.body).to.have.all.keys("access_token", "token_type");
      expect(response.body.access_token).to.be.a("string").and.have.length.greaterThan(20);
      expect(response.body.token_type.toLowerCase()).to.eq("bearer");
    });
  });

  it("TC-API-AUTH-002: invalid login returns error JSON body", () => {
    cy.request({
      method: "POST",
      url: `${apiUrl}/login/access-token`,
      form: true,
      body: { username: Cypress.env("userEmail"), password: "wrong-password" },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 401, 422]);
      expect(response.body).to.be.an("object");
      expect(JSON.stringify(response.body).toLowerCase()).to.match(/incorrect|invalid|detail|error/);
    });
  });

  it("TC-API-AUTH-003: token can access current user data", () => {
    cy.apiLogin().then((token) => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/users/me`,
        headers: { Authorization: `Bearer ${token}` }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("email");
        expect(response.body.email).to.eq(Cypress.env("userEmail"));
        expect(response.body).to.have.property("id");
      });
    });
  });

  it("TC-API-AUTH-004: protected endpoint rejects missing token", () => {
    cy.request({
      method: "GET",
      url: `${apiUrl}/users/me`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 403]);
      expect(response.body).to.be.an("object");
      expect(JSON.stringify(response.body).toLowerCase()).to.match(/not authenticated|unauthorized|detail/);
    });
  });
});
