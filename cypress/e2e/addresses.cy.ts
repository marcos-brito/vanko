import { faker } from "@faker-js/faker";

it("should add a new address", () => {
    const name = faker.company.name();
    const zipCode = "68180620";

    cy.signup();
    cy.visit("/addresses");
    cy.get("button").contains("Adicionar endereço").click();
    cy.get("input[name='name']").type(name);
    cy.get("input[name='zip_code']").type(zipCode);
    cy.get("button[type=submit]").click();
    cy.contains(name).should("exist");
});

it("should delete an address", () => {
    const name = faker.company.name();
    const zipCode = "68180620";

    cy.signup();
    cy.visit("/addresses");
    cy.get("button").contains("Adicionar endereço").click();
    cy.get("input[name='name']").type(name);
    cy.get("input[name='zip_code']").type(zipCode);
    cy.get("button[type=submit]").click();
    cy.get("button").contains("Excluir").click();
    cy.contains("Nenhum endereço cadastrado").should("exist");
});

it("should update an address", () => {
    const name = faker.company.name();
    const zipCode = "68180620";
    const newName = faker.company.name();

    cy.signup();
    cy.visit("/addresses");
    cy.get("button").contains("Adicionar endereço").click();
    cy.get("input[name='name']").type(name);
    cy.get("input[name='zip_code']").type(zipCode);
    cy.get("button[type=submit]").click();
    cy.get("button").contains("Editar").click();
    cy.get("input[name='name']").type(newName);
    cy.get("button[type=submit]").eq(1).click();
    cy.contains(newName).should("exist");
});
