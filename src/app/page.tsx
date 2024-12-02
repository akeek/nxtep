"use client";

import Link from "next/link";
import { Button } from "../../@/components/ui/button";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-center text-5xl py-6">NxtEp</h1>
      {isLoggedIn ? (
        <div id="buttons" className="px-6 grid">
          <Button
            variant="outline"
            className="bg-green-50 hover:bg-green-500 hover:text-white font-semibold"
            asChild
          >
            <Link href="/statsforvalteren">Statsforvalterens høringer</Link>
          </Button>
          <p className="py-3"></p>
          <Button
            variant="outline"
            className="bg-green-50 hover:bg-green-500 hover:text-white font-semibold"
            asChild
          >
            <Link href="/norskeUtslipp">Tillatelser fra Norske Utslipp</Link>
          </Button>
          <p className="py-3"></p>
          <Button
            variant="outline"
            className="bg-green-50 hover:bg-green-500 hover:text-white font-semibold"
            asChild
          >
            <Link href="/havnemagasinet">Havnemagasinet</Link>
          </Button>
        </div>
      ) : (
        <div className="px-6 grid pt-6">
          <Button
            variant="outline"
            className="bg-green-50 hover:bg-green-500 hover:text-white font-semibold"
            asChild
          >
            <Link href="/login">Login</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
