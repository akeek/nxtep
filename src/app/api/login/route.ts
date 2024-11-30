import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import users from "../../../backend/data/users.json";

export async function POST(req: Request) {
  return NextResponse.json({ message: "Login successful" });
  //
  // const { username, password } = await req.json();
  //
  // const user = users.find(
  //   (user: { username: string }) => user.username === username
  // );
  //
  // if (!user) {
  //   return NextResponse.json(
  //     { message: "Invalid credentials" },
  //     { status: 401 }
  //   );
  // }
  //
  // // Compare the hashed password using bcrypt
  // const isPasswordValid = await bcrypt.compare(password, user.password);
  //
  // if (!isPasswordValid) {
  //   return NextResponse.json(
  //     { message: "Invalid credentials" },
  //     { status: 401 }
  //   );
  // }
  //
  // // JWT or session creation logic here (on successful login)
  // return NextResponse.json({ message: "Login successful" });
}
