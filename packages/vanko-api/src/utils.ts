import { faker } from "@faker-js/faker";
import { Gender, InsertUser, Role, Status } from "./models/types/user.ts";

export function generateUser(): InsertUser {
    return {
        id: faker.number.int(214748347),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: Role.User,
        cpf: faker.string.numeric(11),
        name: faker.person.fullName(),
        gender: Gender.Male,
        phone: faker.string.numeric(11),
        ranking: 3,
        status: Status.Active,
        birth: faker.date.anytime()
    };
}

export function generateMultipleUsers(amount: number) {
    let users = [];

    for (let _ = 0; _ < amount; _++) {
        users.push(generateUser());
    }

    return users;
}
