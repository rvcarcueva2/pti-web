import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
    title: "Sign In | Pilipinas Taekwondo Inc.",
  description:
    "Sign In Pilipinas Taekwondo Inc.",
};


export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}