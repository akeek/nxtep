import bcrypt from "bcrypt";

/**
 * Hashes a plain text password using bcrypt.
 * @param password - The plain text password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // Defines the number of salt rounds for bcrypt hashing
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("Hashed Password:", hashedPassword);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing the password");
  }
};

/**
 * Compares a plain text password with a hashed password to verify if they match.
 * @param password - The plain text password to compare.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A promise that resolves to a boolean indicating whether the password is valid.
 */
export const isPasswordValid = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
  } catch (error) {
    throw new Error("Error validating the password");
  }
};
