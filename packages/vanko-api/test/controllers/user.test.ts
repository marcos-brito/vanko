import supertest from "supertest";
import { app } from "@/app.ts";
import db from "@/db.ts";
import { Gender, SelectUser } from "@/models/types/user.ts";
import { presentUser, User } from "@/presenters.ts";
import { Scope } from "@/errors.ts";
import { generateMultipleUsers, generateUser } from "@/utils.ts";
import { DEFAULT_PAGE_SIZE } from "@/schemas/index.ts";

const req = supertest(app.callback());

afterEach(async () => {
    await db.deleteFrom("users").execute();
});

describe("GET /users", () => {
    const users = generateMultipleUsers(100);

    beforeEach(async () => {
        for (const user of users) {
            await db.insertInto("users").values(user).execute();
        }
    });

    it("should return the specified page", async () => {
        const res = await req.get("/users?page=2&pageSize=5");
        const users: Array<User> = res.body.data;

        expect(res.status).toBe(200);
        expect(users.length).toBe(5);
        expect(res.headers).toMatchObject({
            "x-pagination-page": "2",
            "x-pagination-page-size": "5",
            "x-pagination-page-count": "20"
        });
    });

    it("should return at least one user in the last page", async () => {
        let res = await req.get("/users?page=2&pageSize=5");
        const lastPage = res.headers["x-pagination-page-count"];
        res = await req.get(`/users?page=${lastPage}&pageSize=5`);

        expect(res.status).toBe(200);
        expect(users.length).toBeGreaterThan(0);
    });

    it("should return default page when is not specified", async () => {
        const res = await req.get("/users");
        const users: Array<User> = res.body.data;

        expect(res.status).toBe(200);
        expect(users.length).toBe(DEFAULT_PAGE_SIZE);
        expect(res.headers).toMatchObject({
            "x-pagination-page": "1",
            "x-pagination-page-size": "20",
            "x-pagination-page-count": "5"
        });
    });
});

describe("GET /users/:id", () => {
    const user = generateUser();

    beforeAll(async () => {
        user.birth.setHours(0, 0, 0, 0);
        await db.insertInto("users").values(user).execute();
    });

    it("gets a user", async () => {
        const res = await req.get(`/users/${user.id}`);

        expect(res.status).toBe(200);
        expect(res.body.data).toEqual(presentUser(user as SelectUser));
    });

    it("returns 404 if user doesn't exists", async () => {
        const res = await req.get("/users/0");

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
        password: "Pass#123",
        gender: Gender.Male,
        phone: "11987654321",
        birth: new Date()
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
    const user1 = generateUser();

    beforeAll(async () => {
        await db.insertInto("users").values(user1).execute();
    });

    it("should update a user", async () => {
        const update = { name: "Jane doe", gender: Gender.Female };
        const res = await req.patch(`/users/${user1.id}`).send(update);

        expect(res.status).toBe(204);
    });

    describe("should return 409 if value is not unique", () => {
        const user2 = generateUser();

        beforeEach(async () => {
            await db.insertInto("users").values(user1).execute();
            await db.insertInto("users").values(user2).execute();
        });

        it("returns 409 for not unique email", async () => {
            const update = {
                email: user1.email
            };

            const res = await req
                .patch(`/users/${user2.id}`)
                .set("Accept", "application/json")
                .send(update);

            expect(res.status).toBe(409);
        });

        it("returns 409 for not unique cpf", async () => {
            const update = {
                cpf: user1.cpf
            };

            const res = await req
                .patch(`/users/${user2.id}`)
                .set("Accept", "application/json")
                .send(update);

            expect(res.status).toBe(409);
        });

        it("returns 409 for not unique id", async () => {
            const update = {
                id: user1.id
            };

            const res = await req
                .patch(`/users/${user2.id}`)
                .set("Accept", "application/json")
                .send(update);

            expect(res.status).toBe(409);
        });
    });
});

describe("DELETE /users/:id", () => {
    const user = generateUser();

    beforeAll(async () => {
        await db.insertInto("users").values(user).execute();
    });

    it("deletes a user", async () => {
        const res = await req.del(`/users/${user.id}`);

        expect(res.status).toBe(200);
    });

    it("returns 404 if user doesn't exists", async () => {
        const res = await req.get("/users/0");

        expect(res.status).toBe(404);
        expect(res.body.error.scope).toMatch(Scope.NotFoundError);
    });
});
