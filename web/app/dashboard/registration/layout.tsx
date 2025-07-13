import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
    title: "Registration | Pilipinas Taekwondo Inc.",
  description:
    "About Pilipinas Taekwondo Inc.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}