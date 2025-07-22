import type { Metadata } from "next";
import "@/app/globals.css";
import AdminDashboardSidebar from "@/app/components/AdminDashboardSidebar";

export const metadata: Metadata = {
    title: "Competitions | Pilipinas Taekwondo Inc.",
  description:
    "Admin Dashboard - Competitions",
};

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminDashboardSidebar />
      <main className="flex-1 bg-gray-50 p-8">
        {children}
      </main>
    </div>
  );
}