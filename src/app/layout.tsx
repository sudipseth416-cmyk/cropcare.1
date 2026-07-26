import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import ClientOnly from "@/components/Providers/ClientOnly";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "CropCare AI | Precision Agriculture",
  description: "AI-powered crop disease detection and smart farming platform.",
  manifest: "/manifest.json",
};

import { UserProvider } from "@/context/UserContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <UserProvider>
          <ClientOnly>
            {children}
          </ClientOnly>
        </UserProvider>
      </body>
    </html>
  );
}
