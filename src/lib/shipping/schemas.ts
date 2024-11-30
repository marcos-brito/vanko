import { z } from "zod";

export const newShippingInfo = z.object({
    sourceZipCode: z.string().length(8),
    weight: z.number()
});
