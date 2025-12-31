import { PrismaClient, User } from '../generated/prisma'

export interface UserContext {
  prisma: PrismaClient
  user: User | null
  encryptJWT: (user: User) => string
  decryptJWT: (token: string) => Promise<User>
}
