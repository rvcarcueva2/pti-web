import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
    title: "News | Pilipinas Taekwondo Inc.",
  description:
    "News Pilipinas Taekwondo Inc.",
};


export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}