/// <reference types="cypress" />
/// <reference types="cypress-axe" />

describe('Detailed Accessibility Test', () => {
  it('should show accessibility violations details', () => {
    // Visit the application
    cy.visit('/')
    
    // Inject axe into the page
    cy.injectAxe()
    
    // Run accessibility check with detailed logging
    cy.checkA11y(undefined, undefined, (violations) => {
      if (violations.length > 0) {
        console.log('🚨 Accessibility violations found:')
        violations.forEach((violation) => {
          console.log(`❌ ${violation.id}: ${violation.description}`)
          console.log(`   Impact: ${violation.impact}`)
          console.log(`   Help: ${violation.help}`)
          console.log(`   Help URL: ${violation.helpUrl}`)
          console.log(`   Nodes affected: ${violation.nodes.length}`)
          violation.nodes.forEach((node, index) => {
            console.log(`   Node ${index + 1}: ${node.target}`)
            console.log(`   Failure summary: ${node.failureSummary}`)
          })
        })
      }
    })
  })
})