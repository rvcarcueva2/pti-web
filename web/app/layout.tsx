import type { Metadata } from "next";

import { Poppins } from "next/font/google";
import FooterWrapper from "@/app/components/FooterWrapper";
import ResponsiveHeader from "@/app/components/ResponsiveHeader";

import "../lib/fontawesome";
import "./globals.css";





const poppinsBlack = Poppins({
  weight: "900",
  variable: "--font-poppins-black",
  subsets: ["latin"],
  
});

const poppinsRegular = Poppins({
  weight: "400",
  variable: "--font-poppins-regular",
  subsets: ["latin"],
  
});


export const metadata: Metadata = {
  title: "Pilipinas Taekwondo Inc.",
  description: "Official Website of Pilipinas Taekwondo Inc.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${poppinsBlack.variable} ${poppinsRegular.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ResponsiveHeader /> {/* <-- Updated this */}
        {children}
        <FooterWrapper />
      </body>
    </html>
  );
}
