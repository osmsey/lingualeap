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
      <html lang="en" className="h-full">
        <body className="min-h-full font-sans antialiased bg-neutral-50">
          <main className="min-h-screen">
            {children}
          </main>
        </body>
      </html>
    </AuthProvider>
  );
}
