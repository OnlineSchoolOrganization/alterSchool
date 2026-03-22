import type { MutationResolvers } from './../../../types.generated.js'
export const teacherStatUpdate: NonNullable<MutationResolvers['teacherStatUpdate']> = async (
  _parent,
  { stat },
  ctx,
) => {
  return await ctx.prisma.teacherStat.update({
    where: { id: stat.id },
    data: {
      ...(stat.label && { label: stat.label }),
      ...(stat.value && { value: stat.value }),
    },
  })
}
