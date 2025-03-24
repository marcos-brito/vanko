import { faker } from "@faker-js/faker";

it("should change the password", () => {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const newPassword = faker.internet.password();

    cy.signupWith(name, email, password);
    cy.visit("/account");
    cy.get("button").contains("Alterar senha").click();
    cy.get("input[name='old']").type(password);
    cy.get("input[name='new']").type(newPassword);
    cy.get("input[name='confirm']").type(newPassword);
    cy.get("button[type=submit]").click();
    cy.clearCookies();
    cy.signin(email, newPassword);
});

it("should update account information", () => {
    const phone = faker.string.numeric(11);
    const cpf = faker.string.numeric(11);
    const birth = "1983-12-03";

    cy.signup();
    cy.visit("/account");
    cy.get("button").contains("Editar dados").click();
    cy.get("input[name='phone']").type(phone);
    cy.get("input[name='cpf']").type(cpf);
    cy.get("input[name='birth']").type(birth);
    cy.get("button[type=submit]").click();
    cy.contains(phone).should("exist");
    cy.contains(cpf).should("exist");
});
