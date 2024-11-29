"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button"; // Replace with your components
import { useRouter } from "next/navigation";

const ProfilePage: React.FC = () => {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow">
      <h1 className="text-xl font-bold mb-4">User Profile</h1>
      {user ? (
        <div>
          <p>Email: {user.email}</p>
          <Button onClick={handleSignOut} className="mt-4">Sign Out</Button>
        </div>
      ) : (
        <p>You are not signed in. Please sign in to view your profile.</p>
      )}
    </div>
  );
};

export default ProfilePage;
