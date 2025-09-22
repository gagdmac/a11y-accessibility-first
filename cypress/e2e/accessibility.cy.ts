/// <reference types="cypress" />
/// <reference types="cypress-axe" />

describe('Accessibility Tests', () => {
  beforeEach(() => {
    // Visit the application
    cy.visit('/')
    // Inject axe-core into the page
    cy.injectAxe()
  })

  it('should not have accessibility violations on the home page', () => {
    // Check accessibility on the entire page
    cy.checkA11y()
  })

  it('should not have accessibility violations on the accessibility options panel', () => {
    // Open the accessibility options panel
    cy.get('[aria-controls="offcanvasWithBothOptions"]').first().click()
    
    // Wait for the panel to be visible
    cy.get('#offcanvasWithBothOptions').should('be.visible')
    
    // Check accessibility of the accessibility options panel
    cy.checkA11y('#offcanvasWithBothOptions')
  })

  it('should not have accessibility violations on navigation', () => {
    // Test the main navigation
    cy.checkA11y('nav')
  })

  it('should test font size controls for accessibility', () => {
    // Open accessibility options
    cy.get('[aria-controls="offcanvasWithBothOptions"]').first().click()
    cy.get('#offcanvasWithBothOptions').should('be.visible')
    
    // Test font size increase button
    cy.contains('button', 'Increase').should('be.visible').click()
    
    // Check accessibility after font size change
    cy.checkA11y()
    
    // Test font size decrease button  
    cy.contains('button', 'Decrease').should('be.visible').click()
    
    // Check accessibility again
    cy.checkA11y()
  })

  it('should test link highlighting feature for accessibility', () => {
    // Open accessibility options
    cy.get('[aria-controls="offcanvasWithBothOptions"]').first().click()
    cy.get('#offcanvasWithBothOptions').should('be.visible')
    
    // Toggle link highlighting
    cy.contains('button', 'Highlight').click()
    
    // Check accessibility with highlighted links
    cy.checkA11y()
  })

  it('should test keyboard navigation', () => {
    // Test tab navigation through interactive elements
    cy.get('body').type('{tab}')
    cy.focused().should('have.attr', 'href', '#main') // Skip to main content link
    
    cy.focused().type('{tab}')
    // Check accessibility during keyboard navigation
    cy.checkA11y()
  })

  it('should test WCAG 2.1 AA compliance', () => {
    // Test with specific WCAG rules
    cy.checkA11y(undefined, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21aa']
      }
    })
  })

  it('should test form accessibility (if forms exist)', () => {
    // Check for any forms on the page and test their accessibility
    cy.get('form').then(($forms) => {
      if ($forms.length > 0) {
        cy.checkA11y('form')
      }
    })
  })

  it('should test color contrast', () => {
    // Test color contrast specifically
    cy.checkA11y(undefined, {
      runOnly: {
        type: 'rule',
        values: ['color-contrast']
      }
    })
  })
})