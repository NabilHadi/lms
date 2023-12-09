import "@smastrom/react-rating/style.css";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ToastProvider from "@/components/providers/toaster-provider";
import { ConfettiProvider } from "@/components/providers/confetti-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Learning Management System",
  description:
    "Learning Management System for teachers and students to learn and teach online with ease.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <body className={inter.className}>
          <ConfettiProvider />
          <ToastProvider />

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
