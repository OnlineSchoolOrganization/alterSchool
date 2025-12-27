import jwt from "jsonwebtoken";
import { type User } from "./schema/types.generated";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET

export function encryptJWT(user: User): string {
  const payload = {
    id: user.id,
  };

  if(JWT_SECRET === undefined) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
}

export async function decryptJWT(token: string) {
  try {
    if(JWT_SECRET === undefined) {
      throw new Error("JWT_SECRET is not defined");
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as { id: string };
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}
