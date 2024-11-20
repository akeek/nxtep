import bcrypt from "bcrypt";
import fs from "fs/promises";
import path from "path";

// Path to the users.json file
const usersFilePath = path.join(process.cwd(), "public", "data", "users.json");

const hashPasswords = async () => {
  const saltRounds = 10;

  try {
    // Read the existing users file
    const data = await fs.readFile(usersFilePath, "utf-8");
    const users = JSON.parse(data);

    // Hash each user's password
    const hashedUsers = await Promise.all(
      users.map(async (user: any) => {
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        return { ...user, password: hashedPassword };
      })
    );

    // Save the hashed users back to the file
    await fs.writeFile(usersFilePath, JSON.stringify(hashedUsers, null, 2));

    console.log("Users' passwords have been hashed and saved.");
  } catch (error) {
    console.error("Error hashing passwords:", error);
  }
};

// Run the password hashing process
hashPasswords();
