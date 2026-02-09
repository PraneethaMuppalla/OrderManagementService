import { z } from "zod"

export const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export const checkoutSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 digits" }).regex(/^\d+$/, { message: "Phone number must contain only digits" }),
})

export type SignUpFormValues = z.infer<typeof signUpSchema>
export type SignInFormValues = z.infer<typeof signInSchema>
export type CheckoutFormValues = z.infer<typeof checkoutSchema>
