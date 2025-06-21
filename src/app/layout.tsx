import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Incognit0",
    description: "Spill your secrets with Incognit0",
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en">
            <AuthProvider>
                <body className={inter.className}>
                    {children}
                    <Toaster />
                </body>
            </AuthProvider>
        </html>
    );
}
