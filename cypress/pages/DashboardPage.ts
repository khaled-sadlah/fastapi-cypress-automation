import { dashboardSelectors } from "../selectors/dashboard.selectors";

export class DashboardPage {
  assertLoaded() { cy.contains(dashboardSelectors.greetingText).should("be.visible"); }
  assertSidebarVisible() { cy.contains(dashboardSelectors.sidebarText).should("be.visible"); }
  goToItems() { cy.contains('a, button', dashboardSelectors.itemsLinkText).click(); }
}
