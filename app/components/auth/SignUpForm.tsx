"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "@/lib/firebase";
import { Input } from "@/components/ui/input"; 
import {  Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Validation schema using Zod
const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords must match",
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: SignUpFormData) => {
    const auth = getAuth(app);
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      router.push("/profile"); // Redirect to profile page after successful signup
    } catch (err: unknown) {
      setError("Error creating account. Please try again." + err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow">
      <h1 className="text-xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input type="email" {...register("email")} placeholder="Email" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Input type="password" {...register("password")} placeholder="Password" />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <Input type="password" {...register("confirmPassword")} placeholder="Confirm Password" />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
        </div>

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        <Button type="submit" className="w-full">Sign Up</Button>
      </form>
    </div>
  );
};

export default SignUpPage;
