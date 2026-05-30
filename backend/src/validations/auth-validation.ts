import z from "zod";

export const registerSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.email(),
    Password: z.string().min(6).max(100)
})

export type RegisterSchemaType = z.infer<typeof registerSchema>