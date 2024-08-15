import supertest from "supertest";
import { app } from "../../src/index.ts";
import db from "@/db.ts";
import { Gender, Role, Status } from "@/models/types/user.ts";
import { presentUser } from "@/presenters.ts";
import { Scope } from "@/errors.ts";

const req = supertest(app.callback());

describe("GET /users/:id", () => {
    const user = {
        id: 1,
        email: "john.doe@example.com",
        hashed_password:
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

    afterAll(async () => {
        await db.deleteFrom("user").execute();
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

        console.log(res.headers);

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
