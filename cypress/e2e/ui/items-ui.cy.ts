import { ItemsPage } from "../../pages/ItemsPage";

describe("Items UI Tests with API Interception", () => {
  const itemsPage = new ItemsPage();

  beforeEach(() => {
    cy.uiLogin();
    cy.intercept("GET", "**/api/v1/items/**").as("getItems");
    cy.visit("/items");
  });

  it("TC-UI-ITEM-001: items page loads", () => {
    itemsPage.assertLoaded();
  });

  it("TC-UI-ITEM-002: add item button opens form/modal", () => {
    itemsPage.openAddModal();

    cy.get('input[name="title"], textarea[name="title"], input')
      .first()
      .should("be.visible");
  });

  it("TC-UI-ITEM-003: create item with title and description", () => {
    const title = `UI Item ${Date.now()}`;
    const description = "Created from visible Chrome test";

    cy.intercept("POST", "**/api/v1/items/**").as("createItem");

    itemsPage.createItem(title, description);

    cy.wait("@createItem").then((interception) => {
      expect(interception.response?.statusCode).to.be.oneOf([200, 201]);
      expect(interception.response?.body).to.have.property("title", title);
      expect(interception.response?.body).to.have.property("description", description);
    });

    itemsPage.assertItemVisible(title);
  });

  it("TC-UI-ITEM-004: create item with title only", () => {
    const title = `UI Title Only ${Date.now()}`;

    cy.intercept("POST", "**/api/v1/items/**").as("createItem");

    itemsPage.openAddModal();
    itemsPage.fillItem(title);
    itemsPage.save();

    cy.wait("@createItem").then((interception) => {
      expect(interception.response?.statusCode).to.be.oneOf([200, 201]);
      expect(interception.response?.body.title).to.eq(title);
    });

    itemsPage.assertItemVisible(title);
  });

  it("TC-UI-ITEM-005: missing title keeps the item form open", () => {
    itemsPage.openAddModal();
    itemsPage.save();

    cy.get('input[name="title"], textarea[name="title"]').should("exist");
  });

  it("TC-UI-ITEM-006: cancel add item closes form without creating data", () => {
    const title = `Cancelled ${Date.now()}`;

    itemsPage.openAddModal();
    itemsPage.fillItem(title, "This should not be saved");
    itemsPage.cancel();

    cy.contains(title).should("not.exist");
  });

  it("TC-UI-ITEM-007: API interception validates read items response", () => {
    cy.reload();

    cy.wait("@getItems").then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);

      expect(interception.response?.body).to.have.property("data");
      expect(interception.response?.body).to.have.property("count");

      expect(interception.response?.body.data).to.be.an("array");
      expect(interception.response?.body.count).to.be.a("number");
    });
  });
});