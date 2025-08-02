import type { Metadata } from "next";
import "@/app/globals.css";
import AdminPanelSidebar from "@/app/components/AdminPanelSidebar";
import RequireAdmin from "@/app/components/RequireAdmin";

export const metadata: Metadata = {
  title: "Competitions | Admin Panel | Pilipinas Taekwondo Inc.",
  description:
    "Competitions - Admin Panel",
};

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAdmin>
      <div className="flex min-h-screen">
        <AdminPanelSidebar />
        <main className="flex-1 bg-gray-50 p-8">
          {children}
        </main>
      </div>
    </RequireAdmin>
  );
} 
