import type { QueryResolvers } from './../../../types.generated.js'
export const user: NonNullable<QueryResolvers['user']> = async (_parent, _arg, _ctx) => {
  if (!_ctx.user) {
    throw new Error('Unauthorized')
  }
  return _ctx.user
}
