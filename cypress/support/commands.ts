Cypress.Commands.add('launchGame', (gameParam: string) => {
    cy.visit('/')
    cy.get('.input__textarea').should('be.visible')
    cy.get('.input__textarea').clear()
    cy.get('.input__textarea').type(gameParam)
    cy.get('.button').click()
})

export {}
