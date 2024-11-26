"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const userLoggedIn = localStorage.getItem("user");
    if (!userLoggedIn) {
      router.push("/login");
    }
  }, [router]);

  return <>{children}</>;
};
