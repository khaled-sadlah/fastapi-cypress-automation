import { itemSelectors } from "../selectors/items.selectors";

export class ItemsPage {
  visit() {
    cy.visit("/items");
  }

  assertLoaded() {
    cy.contains(itemSelectors.itemPageText).should("be.visible");
  }

  openAddModal() {
    cy.get("button, [role='button']").then(($buttons) => {
      const button = [...$buttons].find((el) => {
        const text = el.textContent?.toLowerCase() || "";
        const aria = el.getAttribute("aria-label")?.toLowerCase() || "";

        return (
          text.includes("add") ||
          text.includes("new") ||
          text.includes("create") ||
          aria.includes("add") ||
          aria.includes("new") ||
          aria.includes("create") ||
          text.includes("+")
        );
      });

      expect(button, "Add Item button").to.exist;
      cy.wrap(button).click();
    });
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