import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/ReduxProvider";
import AuthProvider from "@/components/AuthProvider";
import AuthHandler from "@/components/AuthHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shark Ai- by Vishal",
  description: "Shark-AI is an advanced AI-powered assistant designed to provide intelligent and interactive conversations in regional languages. Built with cutting-edge Natural Language Processing (NLP) and AI models, it enables users to engage in meaningful conversations, ask questions, and receive assistance in their preferred language",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <AuthProvider>
            <AuthHandler/>
            {children}
            </AuthProvider>
        </ReduxProvider>
    
      </body>
    </html>
  );
}
