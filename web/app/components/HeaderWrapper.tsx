"use client";

import { usePathname } from "next/navigation";
import Header from "./header";
import HomeHeader from "@/app/components/HomeHeader";

export default function HeaderWrapper() {
  const pathname = usePathname();

  // Routes that should NOT show any header
  const noHeaderRoutes = ["/sign-in", "/register"];

  if (noHeaderRoutes.includes(pathname)) {
    return null;
  }

  if (pathname === "/") {
    return <HomeHeader />;
  }

  return <Header />;
}
