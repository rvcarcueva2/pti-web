import type { Metadata } from "next";
import "@/app/globals.css";
import UserDashboardSidebar from "@/app/components/UserDashboardSidebar";

export const metadata: Metadata = {
    title: "Players | Pilipinas Taekwondo Inc.",
  description:
    "User Dashboard - Players",
};

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <UserDashboardSidebar />
      <main className="flex-1 bg-gray-50 p-8">
        {children}
      </main>
    </div>
  );
}