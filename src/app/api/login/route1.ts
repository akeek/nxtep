import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs/promises";

const usersFilePath = path.join(
  process.cwd(),
  "src",
  "backend",
  "data",
  "users.json"
);

const getUsers = async () => {
  try {
    const data = await fs.readFile(usersFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading users file:", error);
    throw new Error("Unable to load users data.");
  }
};

// POST request handler for login
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Parse JSON body
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const users = await getUsers();
    const user = users.find((u: any) => u.username === username);

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Check if the password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Respond with a success message (excluding sensitive data)
    return res.status(200).json({
      message: "Login successful",
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
