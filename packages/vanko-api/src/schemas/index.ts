import { z } from "zod";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;

export const paginationSchema = z.object({
    page: z.coerce.number().default(DEFAULT_PAGE),
    pageSize: z.coerce.number().default(DEFAULT_PAGE_SIZE)
});

export type Pagination = z.infer<typeof paginationSchema>;
