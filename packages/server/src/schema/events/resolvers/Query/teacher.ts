import type { QueryResolvers } from './../../../types.generated.js'
export const teacher: NonNullable<QueryResolvers['teacher']> = async (_parent, _arg, _ctx) => {
  return await _ctx.prisma.teacher.findUniqueOrThrow({ where: { id: _arg.teacherId } })
}
