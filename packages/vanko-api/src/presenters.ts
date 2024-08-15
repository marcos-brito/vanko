import { User as UserT } from "@/models/types/user.ts";

export type User = Omit<UserT, "hashed_password">;
