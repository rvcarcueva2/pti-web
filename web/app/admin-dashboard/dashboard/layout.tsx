import type { Metadata } from "next";
import "@/app/globals.css";
import AdminDashboardSidebar from "@/app/components/AdminDashboardSidebar";
import RequireAdmin from "@/app/components/RequireAdmin";

export const metadata: Metadata = {
  title: "Admin Dashboard | Pilipinas Taekwondo Inc.",
  description:
    "Admin Dashboard",
};

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAdmin>
      <div className="flex min-h-screen">
        <AdminDashboardSidebar />
        <main className="flex-1 bg-gray-50 p-8">
          {children}
        </main>
      </div>
    </RequireAdmin>
  );
}