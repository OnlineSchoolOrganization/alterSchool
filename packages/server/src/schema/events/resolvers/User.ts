import { prisma } from '../../../prisma.js';
import type { UserResolvers } from './../../types.generated.js'
export const User: UserResolvers = {
  profiles: async (parent) => {
    return await prisma.profile.findMany({ where: { userId: parent.id as string } })
  }
}
