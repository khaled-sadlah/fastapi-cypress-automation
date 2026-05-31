declare global {
  namespace Cypress {
    interface Chainable {
      apiLogin(): Chainable<string>;
      createItem(token: string, title?: string, description?: string): Chainable<any>;
      deleteItemById(token: string, itemId: string | number): Chainable<any>;
      uiLogin(email?: string, password?: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add("apiLogin", () => {
  const apiUrl = Cypress.env("apiUrl");
  const email = Cypress.env("userEmail");
  const password = Cypress.env("userPassword");

  return cy.request({
    method: "POST",
    url: `${apiUrl}/login/access-token`,
    form: true,
    body: { username: email, password },
    failOnStatusCode: false
  }).then((response) => {
    expect(response.status, "login status").to.eq(200);
    expect(response.body, "login response body").to.have.property("access_token");
    expect(response.body.access_token, "token value").to.be.a("string").and.not.be.empty;
    expect(response.body, "token type").to.have.property("token_type");
    expect(response.body.token_type.toLowerCase()).to.eq("bearer");
    return response.body.access_token;
  });
});

Cypress.Commands.add("createItem", (token: string, title?: string, description?: string) => {
  const apiUrl = Cypress.env("apiUrl");
  const itemTitle = title || `Cypress Item ${Date.now()}`;
  const itemDescription = description || "Created by Cypress automation test";

  return cy.request({
    method: "POST",
    url: `${apiUrl}/items/`,
    headers: { Authorization: `Bearer ${token}` },
    body: { title: itemTitle, description: itemDescription },
    failOnStatusCode: false
  }).then((response) => {
    expect(response.status, "create item status").to.be.oneOf([200, 201]);
    expect(response.body, "created item body").to.have.property("id");
    expect(response.body.title, "created item title").to.eq(itemTitle);
    expect(response.body.description, "created item description").to.eq(itemDescription);
    return response.body;
  });
});

Cypress.Commands.add("deleteItemById", (token: string, itemId: string | number) => {
  const apiUrl = Cypress.env("apiUrl");
  return cy.request({
    method: "DELETE",
    url: `${apiUrl}/items/${itemId}`,
    headers: { Authorization: `Bearer ${token}` },
    failOnStatusCode: false
  });
});

Cypress.Commands.add("uiLogin", (email?: string, password?: string) => {
  cy.visit("/login");
  cy.get('input[name="email"], input[type="email"]').clear().type(email || Cypress.env("userEmail"));
  cy.get('input[name="password"], input[type="password"]').clear().type(password || Cypress.env("userPassword"));
  cy.contains('button, [role="button"]', /log in|login|sign in/i).click();
});

export {};
