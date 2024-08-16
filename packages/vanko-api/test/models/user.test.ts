import "dotenv/config";
import { Gender, Role, Status } from "@/models/types/user.ts";
import _db from "@/db.ts";
import { canUpdate } from "@/models/user.ts";

describe("test canUpdate", () => {
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

    it("should return true if there is no user", async () => {
        expect(await canUpdate(1, user)).toBeTruthy();
    });
});
