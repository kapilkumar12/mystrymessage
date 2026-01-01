import {z} from 'zod';

export const messageSchema = z.object({
    username: z.string().min(3).optional(),
    content  : z.string()
    .min(10, {message: "Content must be at least of 10 characters"})
    .max(300, {message: "Content must be no longer than 300 characters"}),
})