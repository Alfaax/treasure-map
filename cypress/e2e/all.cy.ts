// https://on.cypress.io/api

const gameParam =
    'C​ - 3 - 4 \n' +
    'M​ - 1 - 0 \n' +
    'M​ - 2 - 1 \n' +
    'T​ - 0 - 3 - 2 \n' +
    'T​ - 1 - 3 - 3 \n' +
    'A​ -Lara-1-1-S-AADADAGGA \n'

describe('Le jeu est accessible et est fonctionnel', () => {
    it('La page principale est accessible', () => {
        cy.visit('/')
        cy.contains('h1', 'La carte aux trésors !')
    })

    it('Le jeu est accessible et se lance', () => {
        cy.launchGame(gameParam)
    })

    it('Le jeu est fonctionnel', () => {
        cy.launchGame(gameParam)
        cy.get('.pos-1-1 .gamePlayer').should('be.visible')
        cy.get('.pos-1-0 .gameMountain').should('be.visible')
        cy.get('.pos-2-1 .gameMountain').should('be.visible')
        cy.get('.pos-0-3 .gameTreasure').should('be.visible')
        cy.get('.pos-1-3 .gameTreasure').should('be.visible')
    })

    it('Le résultat du jeu est le bon', () => {
        cy.launchGame(gameParam)
        cy.get('.gameContainer__start').click()
        cy.get('.game__result').should('be.visible')
        cy.get('.game__result').should('contain', 'A - Lara - 0 - 3 - S - 3')
        cy.get('.game__result').should('contain', 'C - 3 - 4')
        cy.get('.game__result').should('contain', 'M - 1 - 0')
        cy.get('.game__result').should('contain', 'M - 2 - 1')
        cy.get('.game__result').should('contain', 'T - 1 - 3 - 2')
    })

    it('Le jeu permet de relancer une partie', () => {
        cy.launchGame(gameParam)
        cy.get('.HomeGame__reset').click()
        cy.get('.input__textarea').should('be.visible')
    })
})
