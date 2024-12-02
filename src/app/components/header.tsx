"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { logout } from "../../lib/utils/logout";
import { Button } from "./ui/button";

function Nav() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <nav>
      <ul className="flex flex-row gap-4">
        <li>
          <Button
            variant="ghost"
            className="hover:bg-green-500 hover:text-white"
          >
            <Link href="/">Hjem</Link>
          </Button>
        </li>
        {user && (
          <Button
            variant="ghost"
            className="hover:bg-green-500 hover:text-white"
            onClick={logout}
          >
            Logout
          </Button>
        )}
      </ul>
    </nav>
  );
}

function Header() {
  return (
    <header className="grid grid-cols-[1fr_auto] pt-5 px-6 pb-4 shadow-sm bg-green-50">
      <div>
        <h2>
          <Link href="/" className="text-2xl font-bold">
            NxtEp
          </Link>
        </h2>
      </div>
      <Nav />
    </header>
  );
}

export default Header;
