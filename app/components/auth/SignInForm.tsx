"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "@/lib/firebase";
import { Input } from "@/components/ui/input"; 
import {  Button } from "@/components/ui/button"; 
import { useRouter } from "next/navigation";

// Validation schema using Zod
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignInPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: SignInFormData) => {
    const auth = getAuth(app);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push("/profile"); // Redirect to profile page on successful login
    } catch (err: any) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow">
      <h1 className="text-xl font-bold mb-4">Sign In</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input type="email" {...register("email")} placeholder="Email" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Input type="password" {...register("password")} placeholder="Password" />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        <Button type="submit" className="w-full">Sign In</Button>
      </form>
    </div>
  );
};

export default SignInPage;
