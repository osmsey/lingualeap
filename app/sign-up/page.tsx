"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Validation schema using Zod
const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  surname: z.string().min(2, "Surname must be at least 2 characters"),
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

  const formatDate = (date: Date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yy = String(date.getFullYear()).slice(-2);
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    
    return {
      date: `${dd}/${mm}/${yy}`,
      time: `${hh}:${min}:${ss}`
    };
  };

  const onSubmit = async (data: SignUpFormData) => {
    const auth = getAuth(app);
    const db = getFirestore(app);
    
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      // Get formatted timestamp
      const timestamp = formatDate(new Date());
      
      // Create Firestore document
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: data.name,
        surname: data.surname,
        email: data.email,
        createdAt: {
          date: timestamp.date,
          time: timestamp.time
        }
      });

      router.push("/profile");
    } catch (err: unknown) {
      setError("Error creating account. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 border border-neutral-200 rounded-md shadow-md">
        <h1 className="text-heading-2 text-neutral-900 mb-6">Create Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-body-bold text-neutral-700 block">Name</label>
            <Input 
              type="text" 
              {...register("name")} 
              placeholder="Enter your name"
              className="w-full h-12 px-4 rounded-md border border-neutral-200 text-body focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
            {errors.name && (
              <p className="text-error-600 text-caption">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-body-bold text-neutral-700 block">Surname</label>
            <Input 
              type="text" 
              {...register("surname")} 
              placeholder="Enter your surname"
              className="w-full h-12 px-4 rounded-md border border-neutral-200 text-body focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
            {errors.surname && (
              <p className="text-error-600 text-caption">{errors.surname.message}</p>
            )}
          </div>

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
              placeholder="Create a password"
              className="w-full h-12 px-4 rounded-md border border-neutral-200 text-body focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
            {errors.password && (
              <p className="text-error-600 text-caption">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-body-bold text-neutral-700 block">Confirm Password</label>
            <Input 
              type="password" 
              {...register("confirmPassword")} 
              placeholder="Confirm your password"
              className="w-full h-12 px-4 rounded-md border border-neutral-200 text-body focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
            {errors.confirmPassword && (
              <p className="text-error-600 text-caption">{errors.confirmPassword.message}</p>
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
            Create Account
          </Button>

          <p className="text-center text-body text-neutral-600">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-brand-600 hover:text-brand-700">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
