import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
    title: "Profile - Pilipinas Taekwondo Inc.",
    description: "Manage your profile settings - Pilipinas Taekwondo Inc.",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return children;
}
