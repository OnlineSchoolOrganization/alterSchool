import type { MutationResolvers } from './../../../types.generated.js'
export const teacherPricingPlanDelete: NonNullable<MutationResolvers['teacherPricingPlanDelete']> = async (
  _parent,
  { planId },
  ctx,
) => {
  await ctx.prisma.pricingPlan.delete({ where: { id: planId } })
  return true
}
