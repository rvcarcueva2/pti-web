import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
    title: "Register | Pilipinas Taekwondo Inc.",
  description:
    "Register Pilipinas Taekwondo Inc.",
};


export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}