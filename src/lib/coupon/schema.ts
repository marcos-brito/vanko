import { z } from "zod";

export const validateCouponSchema = z.object({
    name: z.string()
});
