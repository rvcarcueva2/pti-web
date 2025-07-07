import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
    title: "Competitions | Pilipinas Taekwondo Inc.",
  description:
    "Competitions Pilipinas Taekwondo Inc.",
};


export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}