import { itemSelectors } from "../selectors/items.selectors";

export class ItemsPage {
  visit() {
    cy.visit("/items");
  }

  assertLoaded() {
    cy.contains(itemSelectors.itemPageText).should("be.visible");
  }

  openAddModal() {
  cy.contains("button", /add item/i, { timeout: 15000 })
    .should("be.visible")
    .click();
}

  fillItem(title: string, description?: string) {
    cy.get(itemSelectors.titleInput).clear().type(title);

    if (description) {
      cy.get(itemSelectors.descriptionInput).clear().type(description);
    }
  }

  save() {
    cy.contains('button, [role="button"]', itemSelectors.saveButtonText).click();
  }

  cancel() {
    cy.contains('button, [role="button"]', itemSelectors.cancelButtonText).click();
  }

  createItem(title: string, description?: string) {
    this.openAddModal();
    this.fillItem(title, description);
    this.save();
  }

  assertItemVisible(title: string) {
    cy.contains(title).should("be.visible");
  }
}