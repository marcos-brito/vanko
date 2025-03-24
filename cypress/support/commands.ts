/// <reference types="cypress" />

import { faker } from "@faker-js/faker";

Cypress.Commands.add("signupWith", (name, email, password) => {
    cy.visit("/");
    cy.get("[data-dialog-trigger]").eq(1).click();
    cy.get("[data-value='signup']").eq(0).click();
    cy.get("input[name=name]").type(name);
    cy.get("input[name=email]").eq(1).type(email);
    cy.get("input[name=password]").eq(1).type(password);
    cy.get("input[name=confirm_password]").type(password);
    cy.get("button[type=submit]").eq(1).click().wait(2500);
});

Cypress.Commands.add("signup", () => {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    cy.signupWith(name, email, password);
});

Cypress.Commands.add("signin", (email, password) => {
    cy.visit("/");
    cy.get("[data-dialog-trigger]").eq(1).click();
    cy.get("[data-value='signin']").eq(0).click();
    cy.get("input[name=email]").eq(0).type(email);
    cy.get("input[name=password]").eq(0).type(password);
    cy.get("button[type=submit]").eq(0).click().wait(2500);
});

Cypress.Commands.add("checkAuth", () => {
    cy.getCookie("sb-127-auth-token").should("exist");
});

declare global {
    namespace Cypress {
        interface Chainable {
            checkAuth(): Chainable<void>;
            signin(email: string, password: string): Chainable<void>;
            signup(): Chainable<void>;
            signupWith(
                name: string,
                email: string,
                password: string
            ): Chainable<void>;
        }
    }
}

export {};
