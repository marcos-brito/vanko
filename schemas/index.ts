import { z } from "zod";

export * from "./user.ts";
export * from "./address.ts";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;

export const paginationSchema = z.object({
    page: z.coerce.number().default(DEFAULT_PAGE),
    pageSize: z.coerce.number().default(DEFAULT_PAGE_SIZE)
});

export type Pagination = z.infer<typeof paginationSchema>;

export const IdParameterSchema = z.object({
    id: z.coerce.number()
});

export type IdParameter = z.infer<typeof IdParameterSchema>;
