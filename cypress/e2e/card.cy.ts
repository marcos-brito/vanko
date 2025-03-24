import { faker } from "@faker-js/faker";

it("should add a new card", () => {
    cy.signup();
    cy.addCard();
    cy.contains("Nenhum cartão cadastrado").should("not.exist");
});

it("should update a card", () => {
    const alias = faker.company.name();
    const holder = faker.person.fullName();

    cy.signup();
    cy.addCard();
    cy.visit("/cards");
    cy.get("button").contains("Editar cartão").click();
    cy.get("input[name='alias']").type(alias);
    cy.get("input[name='holder']").type(holder);
    cy.get("button[type=submit]").eq(1).click();
    cy.contains(alias).should("exist");
});

it("should delete an card", () => {
    cy.signup();
    cy.addCard();
    cy.get("button").contains("Excluir").click();
    cy.contains("Nenhum cartão cadastrado").should("exist");
});
