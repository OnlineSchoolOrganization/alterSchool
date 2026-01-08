import { prisma } from '../../../../prisma.js'
import type { QueryResolvers } from './../../../types.generated.js'
export const usersCount: NonNullable<QueryResolvers['usersCount']> = async (_parent, _arg, _ctx) => {
  if (!_ctx.user?.role.includes('SUPER_USER')) {
    throw new Error('Forbidden')
  }

  return await prisma.user.count({
    where: _arg.filter
      ? {
          OR: [
            { email: { contains: _arg.filter, mode: 'insensitive' } },
            { firstName: { contains: _arg.filter, mode: 'insensitive' } },
            { lastName: { contains: _arg.filter, mode: 'insensitive' } },
          ],
        }
      : undefined,
  })
}
