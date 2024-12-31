declare namespace Cypress {
    interface Chainable {
        launchGame(gameParam: string): Chainable<Element>
    }
}
