import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | MagicTube",
    default: "MagicTube",
  },
  description:
    "Enjoy the videos and music you love, and upload and share original content with friends, family, and the world on MagicTube.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={"/"}>
      <html lang="en">
        <body className={`${inter.className} antialiased`}>
          <TRPCReactProvider>
            <Toaster />
            {children}
          </TRPCReactProvider>{" "}
        </body>
      </html>
    </ClerkProvider>
  );
}
