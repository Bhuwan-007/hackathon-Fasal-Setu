import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppProvider";
import { TopBar } from "@/components/TopBar";
import { Navigation } from "@/components/Navigation";
import { SkyCanvas } from "@/components/SkyCanvas";
import { LeafDropper } from "@/components/LeafDropper";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-sans-devanagari",
  subsets: ["devanagari"],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: "FasalSetu",
  description: "Agritech advisory app for Indian farmers",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${notoSansDevanagari.variable} antialiased`}>
      <body className="min-h-screen relative flex flex-col justify-between bg-[#030712]">
        <SkyCanvas />
        <AppProvider>
          <LeafDropper />
          <div className="relative z-10 flex flex-col min-h-screen">
            <TopBar />
            <main className="flex-1 max-w-md mx-auto w-full p-4 pb-24">
              {children}
            </main>
            <Navigation />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}

