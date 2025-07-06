import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Poppins } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppinsBlack = Poppins({
  weight: "900",
  subsets: ["latin"],
  variable: "--font-poppins-black",
});

const poppinsRegular = Poppins({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-poppins-regular",
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
        className={`${geistSans.variable} ${geistMono.variable} ${poppinsBlack.variable} ${poppinsRegular.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
