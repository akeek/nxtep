"use client";

import Link from "next/link";

function Nav() {
  return (
    <nav>
      <ul className="flex flex-row gap-4">
        <li>
          <Link href="/">Hjem</Link>
        </li>
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
