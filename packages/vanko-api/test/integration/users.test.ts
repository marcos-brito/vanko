import { Gender } from "@/models/types/user.ts";
import { Address, User } from "@/presenters.ts";
import { Scope } from "@/errors.ts";
import {
    addressCreateSchema,
    DEFAULT_PAGE_SIZE,
    UserCreateSchema
} from "@/schemas/index.ts";
import { sql } from "kysely";
import TestAgent from "supertest/lib/agent.js";
import { App } from "../index.ts";
import { generateMock } from "@anatine/zod-mock";

const testApp = new App();
let req: TestAgent;

beforeAll(async () => {
    await testApp.initialize();
    req = testApp.req!;
}, 15000);

afterAll(async () => {
    await testApp.destroy();
});

afterEach(async () => {
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`.execute(
        testApp.db!
    );
});

describe("GET /users", () => {
    let users: Array<User> = [];

    beforeEach(async () => {
        const responses = await Promise.all(
            Array.from({ length: 20 }, () =>
                req.post("/users").send(generateMock(UserCreateSchema))
            )
        );

        users = responses.map((res) => res.body.data);
    });

    it("should return the specified page", async () => {
        const res = await req.get("/users?page=2&pageSize=2");
        const users: Array<User> = res.body.data;

        expect(res.status).toBe(200);
        expect(users.length).toBe(2);
        expect(res.headers).toMatchObject({
            "x-pagination-page": "2",
            "x-pagination-page-size": "2",
            "x-pagination-page-count": "10"
        });
    });

    it("should return at least one user in the last page", async () => {
        let res = await req.get("/users?page=2&pageSize=2");
        const lastPage = res.headers["x-pagination-page-count"];
        res = await req.get(`/users?page=${lastPage}&pageSize=10`);

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
            "x-pagination-page-count": "1"
        });
    });
});

describe("GET /users/:id", () => {
    let user: User;

    beforeAll(async () => {
        user = (await req.post("/users").send(generateMock(UserCreateSchema)))
            .body.data;
    });

    it("gets a user", async () => {
        const res = await req.get(`/users/${user.id}`);

        expect(res.status).toBe(200);
        expect(res.body.data).toEqual(user);
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
    const user = generateMock(UserCreateSchema);

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
    let user1: User;

    beforeAll(async () => {
        user1 = (await req.post("/users").send(generateMock(UserCreateSchema)))
            .body.data;
    });

    it("should update a user", async () => {
        const update = { name: "Jane doe", gender: Gender.Female };
        const res = await req.patch(`/users/${user1.id}`).send(update);

        expect(res.status).toBe(204);
    });

    describe("should return 409 if value is not unique", () => {
        let user2: User;

        beforeEach(async () => {
            user1 = (
                await req.post("/users").send(generateMock(UserCreateSchema))
            ).body.data;
            user2 = (
                await req.post("/users").send(generateMock(UserCreateSchema))
            ).body.data;
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
    let user: User;

    beforeAll(async () => {
        user = (await req.post("/users").send(generateMock(UserCreateSchema)))
            .body.data;
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

describe("GET users/:id/addresses/", () => {
    let user: User;
    let addresses: Array<Address> = [];

    beforeAll(async () => {
        user = (await req.post("/users").send(generateMock(UserCreateSchema)))
            .body.data;

        for (let _ = 0; _ < 4; _++) {
            addresses.push(
                (
                    await req
                        .post(`/users/${user.id}/addresses/`)
                        .send(generateMock(addressCreateSchema))
                ).body.data
            );
        }
    });

    it("should return all addresses belonging to the specified user", async () => {
        const res = await req.get(`/users/${user.id}/addresses`);

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(addresses.length);
    });

    it("should return 404 if user was not found", async () => {
        const res = await req.get(`/users/0/addresses`);

        expect(res.status).toBe(404);
    });
});

describe("POST users/:id/addresses/", () => {
    const address = generateMock(addressCreateSchema);
    let user: User;

    beforeAll(async () => {
        user = (await req.post("/users").send(generateMock(UserCreateSchema)))
            .body.data;
    });

    it("should create an address for the specified user", async () => {
        const res = await req.post(`/users/${user.id}/addresses`).send(address);
        // besides these three everything should be the same
        const { city, country, state, ...expected } = address;

        expect(res.status).toBe(201);
        expect(res.body.data).toMatchObject(expected);
    });
});
