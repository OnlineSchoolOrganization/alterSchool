import type { QueryResolvers } from './../../../types.generated.js'
export const me: NonNullable<QueryResolvers['me']> = async (_parent, _arg, _ctx) => {
  if(_arg.userId) {
    if(!_ctx.user?.role.includes('SUPER_USER') && _ctx.user?.id !== _arg.userId) {
      throw new Error('Unauthorized')
    }
    const user = await _ctx.prisma.user.findUnique({
      where: { id: _arg.userId },
    })
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }
  if (!_ctx.user) {
    throw new Error('Unauthorized')
  }
  return _ctx.user
}
