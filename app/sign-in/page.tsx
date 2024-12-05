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
import Link from "next/link";

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
      router.push("/profile");
    } catch (err: unknown) {
      setError("Invalid email or password." +err);
    }
  };




  
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 border border-neutral-200 rounded-md shadow-md">
        <h1 className="text-heading-2 text-neutral-900 mb-6">Sign In</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-body-bold text-neutral-700 block">Email</label>
            <Input 
              type="email" 
              {...register("email")} 
              placeholder="Enter your email"
              className="w-full h-12 px-4 rounded-md border border-neutral-200 text-body focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
            {errors.email && (
              <p className="text-error-600 text-caption">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-body-bold text-neutral-700 block">Password</label>
            <Input 
              type="password" 
              {...register("password")} 
              placeholder="Enter your password"
              className="w-full h-12 px-4 rounded-md border border-neutral-200 text-body focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
            {errors.password && (
              <p className="text-error-600 text-caption">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <div className="bg-error-50 text-error-600 p-3 rounded-md text-caption">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition-colors font-body-bold shadow-sm"
          >
            Sign In
          </Button>

          <p className="text-center text-body text-neutral-600">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-brand-600 hover:text-brand-700">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
