import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About PTI",
  description:
    "About Pilipinas Taekwondo Inc.",
};


export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}