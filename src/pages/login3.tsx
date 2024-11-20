import { useState } from "react";
import { useRouter } from "next/router";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/statsforvalteren"); // Redirect on successful login
    } else {
      const err = await response.json();
      setError(err.error);
    }
  };

  return (
    <>
      <div className="container mx-auto">
        <h1 className="text-center">You need to log in mafakka</h1>
        <div className="block">
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form className="block" onSubmit={handleLogin}>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
