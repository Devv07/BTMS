import {z} from "zod";

export const loginSchema = z.object({
    email:z
    .string()
    .email({message:"Invalid email address"})
    .nonempty({message:"Email is required"}),
    
    password:z
    .string()
    .min(6,{message:"Password must be at least 6 characters"})
    .nonempty({message:"Password is required"}),
});

export type LoginFormData = z.infer<typeof loginSchema>;