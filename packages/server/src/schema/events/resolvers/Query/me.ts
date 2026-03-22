import type { QueryResolvers } from './../../../types.generated.js'
export const me: NonNullable<QueryResolvers['me']> = async (_parent, _arg, _ctx) => {
  if (_arg.userId) {
    const user = await _ctx.prisma.user.findUnique({
      where: { id: _arg.userId },
    })
    return user
  }
  return _ctx.user
}
