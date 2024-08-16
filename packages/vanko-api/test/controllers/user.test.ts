import supertest from "supertest";
import { app } from "../../src/index.ts";
import db from "@/db.ts";
import { Gender, Role, Status } from "@/models/types/user.ts";
import { presentUser } from "@/presenters.ts";
import { Scope } from "@/errors.ts";

const req = supertest(app.callback());

afterEach(async () => {
    await db.deleteFrom("user").execute();
});

describe("GET /users/:id", () => {
    const user = {
        id: 1,
        email: "john.doe@example.com",
        password:
            "$2b$10$7/0ByQkW7G3VhgXv7kjU2OEtVV6WvXpFeS5G.T/hINJfPQa8U3hCe",
        role: Role.User,
        name: "John Doe",
        gender: Gender.Male,
        cpf: "12345678900",
        phone: "11987654321",
        ranking: 3,
        status: Status.Active
    };

    beforeAll(async () => {
        await db.insertInto("user").values(user).execute();
    });

    it("gets a user", async () => {
        const res = await req.get("/users/1");

        expect(res.status).toBe(200);
        expect(res.body.data).toEqual(presentUser(user));
    });

    it("returns 404 if user doesn't exists", async () => {
        const res = await req.get("/users/22");

        expect(res.status).toBe(404);
        expect(res.body.error.scope).toMatch(Scope.NotFoundError);
    });

    it("returns 400 when id is NaN", async () => {
        const res = await req.get("/users/b{2%");

        expect(res.status).toBe(400);
        expect(res.body.error.scope).toMatch(Scope.ValidationError);
    });
});

describe("POST /users/", () => {
    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
        cpf: "12345678900",
        password: "supersecretpassword",
        gender: Gender.Male,
        phone: "11987654321"
    };

    it("should create a user", async () => {
        const res = await req
            .post("/users")
            .set("Accept", "application/json")
            .send(user);

        expect(res.status).toBe(201);
        expect(res.headers["location"]).toMatch(new RegExp(".users/[0-9]+"));
        expect(res.body.data.email).toEqual(user.email);
    });

    it("returns 400 for bad payload", async () => {
        const res = await req.post("/users").send({ name: "Jane Doe" });

        expect(res.status).toBe(400);
        expect(res.body.error.scope).toMatch(Scope.ValidationError);
    });
});

describe("PATCH /users/:id", () => {
    const joe = {
        id: 1,
        email: "john.doe@example.com",
        password:
            "$2b$10$7/0ByQkW7G3VhgXv7kjU2OEtVV6WvXpFeS5G.T/hINJfPQa8U3hCe",
        role: Role.User,
        name: "John Doe",
        gender: Gender.Male,
        cpf: "12345678900",
        phone: "11987654321",
        ranking: 3,
        status: Status.Active
    };

    beforeAll(async () => {
        await db.insertInto("user").values(joe).execute();
    });

    it("should update a user", async () => {
        const update = { name: "Jane doe", gender: Gender.Female };
        const res = await req.patch("/users/1").send(update);

        expect(res.status).toBe(204);
    });

    describe("should return 409 if value is not unique", () => {
        const jane = {
            id: 2,
            email: "jane.doe@example.com",
            password:
                "$2b$10$7/0ByQkW7G3VhgXv7kjU2OEtVV6WvXpFeS5G.T/hINJfPQa8U3hCe",
            role: Role.User,
            name: "Jane Doe",
            gender: Gender.Female,
            cpf: "12345678911",
            phone: "11987654321",
            ranking: 3,
            status: Status.Active
        };

        beforeEach(async () => {
            await db.insertInto("user").values(joe).execute();
            await db.insertInto("user").values(jane).execute();
        });

        it("returns 409 for not unique email", async () => {
            const update = {
                email: "john.doe@example.com"
            };

            const res = await req
                .patch("/users/2")
                .set("Accept", "application/json")
                .send(update);

            expect(res.status).toBe(409);
        });

        it("returns 409 for not unique cpf", async () => {
            const update = {
                cpf: "12345678900"
            };

            const res = await req
                .patch("/users/2")
                .set("Accept", "application/json")
                .send(update);

            expect(res.status).toBe(409);
        });

        it("returns 409 for not unique id", async () => {
            const update = {
                id: 1
            };

            const res = await req
                .patch("/users/2")
                .set("Accept", "application/json")
                .send(update);

            expect(res.status).toBe(409);
        });
    });
});
