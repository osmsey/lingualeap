import type { Metadata } from "next";

import "./globals.css";
import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";



export const metadata: Metadata = {
  title: "LinguaLeap",
  description: "Language Learning Ally",
};



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </AuthProvider>
  );
}
