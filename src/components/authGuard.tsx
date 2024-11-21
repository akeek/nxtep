"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const userLoggedIn = localStorage.getItem("user"); // Mock authentication check
    if (!userLoggedIn) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [router]);

  return <>{children}</>;
};
