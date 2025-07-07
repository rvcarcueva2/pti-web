import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
    title: "About PTI",
  description:
    "About Pilipinas Taekwondo Inc.",
};


export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}