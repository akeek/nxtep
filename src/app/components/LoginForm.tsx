"use client";

import { useState } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();

      localStorage.setItem(
        "user",
        JSON.stringify({ username, token: data.token })
      );

      window.location.href = "/";
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[500px] h-[500px] flex justify-center items-center relative"
    >
      <i></i>
      <i></i>
      <i></i>
      <div className="w-[300px] h-full flex justify-center items-center flex-col gap-5 z-10">
        <h1 className="text-xl text-white">Login</h1>
        <input
          className="w-full py-3 px-5 bg-transparent border-2 border-white rounded-3xl outline-none text-white text-lg"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full py-3 px-5 bg-transparent border-2 border-white rounded-3xl outline-none text-white text-lg"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full py-3 px-5 rounded-3xl border-none text-lg cursor-pointer text-white bg-gradient-to-r from-purple-500 to-pink-500"
          type="submit"
        >
          Login
        </button>
      </div>
      {error && <p>{error}</p>}
    </form>
  );
}
