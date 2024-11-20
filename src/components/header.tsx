"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { logout } from "../lib/utils/logout";
import { Button } from "./ui/button";

function Nav() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the user exists in localStorage on component mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse and set user info
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

        {/* Conditionally render logout button if there is a user */}
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
            The next episode
          </Link>
        </h2>
      </div>
      <Nav />
    </header>
  );
}

export default Header;
