import type { Metadata } from "next";
import "@/app/globals.css";
import AdminPanelSidebar from "@/app/components/AdminPanelSidebar";

export const metadata: Metadata = {
  title: "Users | Pilipinas Taekwondo Inc.",
  description:
    "Users",
};

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="flex min-h-screen">
        <AdminPanelSidebar />
        <main className="flex-1 bg-gray-50 p-8">
          {children}
        </main>
      </div>
  );
}