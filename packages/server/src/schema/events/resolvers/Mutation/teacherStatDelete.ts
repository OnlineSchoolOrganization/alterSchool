import type { MutationResolvers } from './../../../types.generated.js'
export const teacherStatDelete: NonNullable<MutationResolvers['teacherStatDelete']> = async (
  _parent,
  { statId },
  ctx,
) => {
  await ctx.prisma.teacherStat.delete({ where: { id: statId } })
  return true
}
