"use client";

import CombinedData from "./combinedData";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Statsforvalteren = () => {
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
      <CombinedData />
    </div>
  );
};

export default Statsforvalteren;
