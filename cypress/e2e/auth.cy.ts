import { faker } from "@faker-js/faker";

describe("redirect", () => {
    it("should redirect if not autheticated", () => {
        const pages = ["/account", "/addresses", "/dashboard"];

        for (const page of pages) {
            cy.visit(page);
            cy.location("pathname").should("equal", "/");
        }
    });
});

describe("signup", () => {
    it("should signup a user", () => {
        cy.signup();
        cy.checkAuth();
    });

    it("should show toast when submiting invalid data", () => {
        const name = faker.person.fullName();
        const password = faker.internet.password();
        const email = "someinvalidemail.com";

        cy.visit("/");
        cy.signupWith(name, email, password);
        cy.get(".toast").should("be.visible");
    });
});

describe("signin", () => {
    it("should signin a user", () => {
        const name = faker.person.fullName();
        const email = faker.internet.email();
        const password = faker.internet.password();

        cy.signupWith(name, email, password);
        cy.clearCookies();
        cy.signin(email, password);
        cy.checkAuth();
    });

    it("should show toast when submiting invalid data", () => {
        const password = faker.internet.password();
        const email = "someinvalidemail.com";

        cy.visit("/");
        cy.signin(email, password);
        cy.get(".toast").should("be.visible");
    });
});
