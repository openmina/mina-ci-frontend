describe('SUB MENU TABS', () => {
  it('display tabs', () => {
    cy.visit(Cypress.config().baseUrl)
      .get('mina-submenu-tabs a')
      .should('have.length', 3);
  });

  it('display builds tab as active', () => {
    cy.visit(Cypress.config().baseUrl + '/builds')
      .get('mina-submenu-tabs a.active')
      .then((a: any) => expect(a.text().toLowerCase()).contains('builds'));
  });

  it('display compare tab as active', () => {
    cy.visit(Cypress.config().baseUrl + '/compare')
      .get('mina-submenu-tabs a.active')
      .then((a: any) => expect(a.text().toLowerCase()).contains('compare'));
  });

  it('display trends tab as active', () => {
    cy.visit(Cypress.config().baseUrl + '/trends')
      .get('mina-submenu-tabs a.active')
      .then((a: any) => expect(a.text().toLowerCase()).contains('trends'));
  });
});
