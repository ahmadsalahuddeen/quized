import { z } from 'zod';

export const quizCreationSchema = z.object({
  topic: z
    .string()
    .min(4, { message: 'Topic must be atleast 4 characters long' })
    .max(60, { message: "Topic shouldn't exceed 60 characters" }),
  type: z.enum(["mcq","open-ended"]),
  amount: z.number().min(1).max(10),
});
