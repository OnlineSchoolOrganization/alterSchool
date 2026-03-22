import type { MutationResolvers } from './../../../types.generated.js'
export const teacherStatCreate: NonNullable<MutationResolvers['teacherStatCreate']> = async (_parent, { teacherId, stat }, ctx) => {
  return await ctx.prisma.teacherStat.create({ data: { teacherId, ...stat } })
}
