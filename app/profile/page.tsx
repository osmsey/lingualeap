"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button"; // Replace with your components
import { useRouter } from "next/navigation";
import Link from "next/link";

const ProfilePage: React.FC = () => {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-body text-neutral-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 border border-neutral-200 rounded-md shadow-md">
        <h1 className="text-heading-2 text-neutral-900 mb-6">User Profile</h1>
        {user ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-body-bold text-neutral-700 block">Email</label>
              <p className="text-body text-neutral-900 p-3 bg-neutral-50 rounded-md">
                {user.email}
              </p>
            </div>
            
            <Button 
              onClick={handleSignOut} 
              className="w-full h-12 bg-error-600 text-white rounded-md hover:bg-error-700 transition-colors font-body-bold shadow-sm"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-body text-neutral-600 text-center">
              You are not signed in. Please sign in to view your profile.
            </p>
            <Link 
              href="/sign-in"
              className="block w-full h-12 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition-colors font-body-bold shadow-sm flex items-center justify-center"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
