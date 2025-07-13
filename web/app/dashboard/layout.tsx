import type { Metadata } from "next";
import "@/app/globals.css";
import Sidebar from "@/app/components/Sidebar";

export const metadata: Metadata = {
    title: "Dashboard | Pilipinas Taekwondo Inc.",
  description:
    "About Pilipinas Taekwondo Inc.",
};

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-8">
        {children}
      </main>
    </div>
  );
}