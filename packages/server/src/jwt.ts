import jwt from 'jsonwebtoken'
import { type User } from './schema/types.generated'

const JWT_SECRET = process.env.JWT_SECRET

export function encryptJWT(user: User): string {
  const payload = {
    id: user.id,
  }

  if (JWT_SECRET === undefined) {
    throw new Error('JWT_SECRET is not defined')
  }

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  })

  return token
}

export function decryptJWT(token: string): { id: string } | null {
  const decoded = jwt.decode(token)
  return decoded as { id: string } | null
}
