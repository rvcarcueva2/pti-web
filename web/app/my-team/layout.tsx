import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
    title: "My Team - Pilipinas Taekwondo Inc.",
    description: "Manage your team settings - Pilipinas Taekwondo Inc.",
};

export default function MyTeamLayout({ children }: { children: React.ReactNode }) {
    return children;
}
