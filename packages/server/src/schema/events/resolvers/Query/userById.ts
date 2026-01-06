import type { QueryResolvers } from './../../../types.generated.js'
export const userById: NonNullable<QueryResolvers['userById']> = async (_parent, _arg, _ctx) => {
  if (!_ctx.user?.role.includes('SUPER_USER')) {
    throw new Error('Unauthorized')
  }
  return await _ctx.prisma.user.findUnique({ where: { id: _arg.id } })
}
