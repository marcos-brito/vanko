import supertest from "supertest";
import { app } from "../../src/index.ts";
import db from "@/db.ts";
import { Gender, Role, Status, User } from "@/models/types/user.ts";
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

    it("gets a user", async () => {
        const res = await req.get("/users/1");

        expect(res.status).toBe(200);
        expect(res.body).toEqual(user as User);
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
