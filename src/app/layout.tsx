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
  openGraph: {
    title: "MagicTube",
    description:
      "Enjoy the AI videos and music you love, and upload and share original content with friends, family, and the world on MagicTube.",
    images: ["https://magictube.matheusbronca.com/og-img.jpg"],
    type: "website",
    siteName: "MagicTube",
    url: "https://magictube.matheusbronca.com.br",
  },
  twitter: {
    title: "MagicTube",
    description:
      "Enjoy the AI videos and music you love, and upload and share original content with friends, family, and the world on MagicTube.",
    images: ["https://magictube.matheusbronca.com/og-img.jpg"],
    site: "https://magictube.matheusbronca.com.br",
  },
  description:
    "Enjoy the AI videos and music you love, and upload and share original content with friends, family, and the world on MagicTube.",
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
          <div id="sticky-root" />
          <TRPCReactProvider>
            <Toaster />
            {children}
          </TRPCReactProvider>{" "}
        </body>
      </html>
    </ClerkProvider>
  );
}
