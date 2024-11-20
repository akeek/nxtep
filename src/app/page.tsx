"use client";

import Link from "next/link";
import { Button } from "../components/ui/button";

const HomePage = () => {
  return (
    <div className="container px-6">
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
