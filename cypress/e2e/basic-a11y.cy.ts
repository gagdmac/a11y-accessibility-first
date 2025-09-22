/// <reference types="cypress" />
/// <reference types="cypress-axe" />

describe('Basic Accessibility Test', () => {
  it('should pass basic accessibility checks on home page', () => {
    // Visit the application
    cy.visit('/')
    
    // Inject axe into the page
    cy.injectAxe()
    
    // Run accessibility check
    cy.checkA11y()
  })
})