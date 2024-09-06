import { App } from "../index.ts";
import { sql } from "kysely";
import TestAgent from "supertest/lib/agent.js";
import { generateMock } from "@anatine/zod-mock";
import { Address, User, UserCreateSchema } from "@/index.ts";
import { addressCreateSchema } from "@/schemas/address.ts";

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
    await sql`TRUNCATE TABLE addresses RESTART IDENTITY CASCADE`.execute(
        testApp.db!
    );
});

describe("DELETE /addresses/:id", () => {
    let user: User;
    let address: Address;

    beforeAll(async () => {
        user = (await req.post("/users").send(generateMock(UserCreateSchema)))
            .body.data;
        address = (
            await req
                .post(`/users/${user.id}/addresses`)
                .send(generateMock(addressCreateSchema))
        ).body.data;
    });

    it("should delete the specified address", async () => {
        const res = await req.del(`/addresses/${address.id}`);

        expect(res.status).toBe(200);
    });

    it("should return 404 if address does not exist", async () => {
        const res = await req.del("/addresses/0");

        expect(res.status).toBe(404);
        expect(res.body.error.scope).toMatch("not_found_error");
    });
});

describe("PATCH /addresses/:id", () => {
    let user: User;
    let address: Address;

    beforeAll(async () => {
        user = (await req.post("/users").send(generateMock(UserCreateSchema)))
            .body.data;
        address = (
            await req
                .post(`/users/${user.id}/addresses`)
                .send(generateMock(addressCreateSchema))
        ).body.data;
    });

    it("should update the specified address", async () => {
        const update = { name: "name" };
        const res = await req.patch(`/addresses/${address.id}`).send(update);

        expect(res.status).toBe(204);
    });

    it("should return 404 if address does not exist", async () => {
        const update = { name: "name" };
        const res = await req.patch("/addresses/0").send(update);

        expect(res.status).toBe(404);
        expect(res.body.error.scope).toMatch("not_found_error");
    });
});
