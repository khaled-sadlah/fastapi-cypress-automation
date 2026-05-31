describe("Items API Tests - Independent Test Data", () => {
  let token: string;
  const apiUrl = Cypress.env("apiUrl");

  beforeEach(() => {
    cy.apiLogin().then((accessToken) => {
      token = accessToken;
    });
  });

  it("TC-API-ITEM-001: read items returns JSON array", () => {
    cy.request({
      method: "GET",
      url: `${apiUrl}/items/`,
      headers: { Authorization: `Bearer ${token}` }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.headers["content-type"]).to.include("application/json");
      expect(response.body).to.have.property("data")
      expect(response.body).to.have.property("count")
      expect(response.body.data).to.be.an("array")
      expect(response.body.count).to.be.a("number")
      if (response.body.length > 0) {
        expect(response.body[0]).to.have.property("id");
        expect(response.body[0]).to.have.property("title");
      }
    });
  });

  it("TC-API-ITEM-002: create item returns created item data", () => {
    const title = `API Create ${Date.now()}`;
    const description = "Checking response body, not only status code";

    cy.createItem(token, title, description).then((item) => {
      expect(item.id).to.exist;
      expect(item.title).to.eq(title);
      expect(item.description).to.eq(description);
      cy.deleteItemById(token, item.id);
    });
  });

  it("TC-API-ITEM-003: get item by ID returns the same created item", () => {
    const title = `API Get ${Date.now()}`;
    const description = "Created before GET action";
    let itemId: string | number;

    cy.createItem(token, title, description).then((item) => {
      itemId = item.id;
      cy.request({
        method: "GET",
        url: `${apiUrl}/items/${itemId}`,
        headers: { Authorization: `Bearer ${token}` }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.id).to.eq(itemId);
        expect(response.body.title).to.eq(title);
        expect(response.body.description).to.eq(description);
      });
    }).then(() => {
      cy.deleteItemById(token, itemId);
    });
  });

  it("TC-API-ITEM-004: update item uses generated ID and verifies updated data", () => {
    let itemId: string | number;
    const originalTitle = `API Before Update ${Date.now()}`;
    const updatedTitle = `API After Update ${Date.now()}`;

    cy.createItem(token, originalTitle, "Original description").then((item) => {
      itemId = item.id;
      cy.request({
        method: "PUT",
        url: `${apiUrl}/items/${itemId}`,
        headers: { Authorization: `Bearer ${token}` },
        body: { title: updatedTitle, description: "Updated description" },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 201]);
        expect(response.body.id).to.eq(itemId);
        expect(response.body.title).to.eq(updatedTitle);
        expect(response.body.description).to.eq("Updated description");
      });
    }).then(() => {
      cy.deleteItemById(token, itemId);
    });
  });

  it("TC-API-ITEM-005: delete item creates data first then deletes by generated ID", () => {
    let itemId: string | number;
    cy.createItem(token, `API Delete ${Date.now()}`, "Created only for delete test").then((item) => {
      itemId = item.id;
      cy.deleteItemById(token, itemId).then((deleteResponse) => {
        expect(deleteResponse.status).to.be.oneOf([200, 204]);
      });
    }).then(() => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/items/${itemId}`,
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([404, 400]);
      });
    });
  });

  it("TC-API-ITEM-006: create item without title returns validation error", () => {
    cy.request({
      method: "POST",
      url: `${apiUrl}/items/`,
      headers: { Authorization: `Bearer ${token}` },
      body: { description: "Missing title" },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 422]);
      expect(response.body).to.be.an("object");
      expect(JSON.stringify(response.body).toLowerCase()).to.match(/title|required|field|detail/);
    });
  });
});
