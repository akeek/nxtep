"use client";

import Link from "next/link";
import { Button } from "../components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Mocking a check for user login
    const userLoggedIn = localStorage.getItem("user");
    if (!userLoggedIn) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [router]);

  return (
    <div className="container mx-auto">
      <h1 className="text-center text-5xl py-6">Welcome to the Next Episode</h1>
      <Button
        variant="outline"
        className="bg-green-50 hover:bg-green-500 hover:text-white font-semibold"
        asChild
      >
        <Link href="/statsforvalteren">Statsforvalterens høringer</Link>
      </Button>
    </div>
  );
};

export default HomePage;
