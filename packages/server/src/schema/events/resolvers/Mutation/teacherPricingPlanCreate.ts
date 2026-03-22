import type { MutationResolvers } from './../../../types.generated.js'
export const teacherPricingPlanCreate: NonNullable<MutationResolvers['teacherPricingPlanCreate']> = async (
  _parent,
  { teacherId, plan },
  ctx,
) => {
  const res = await ctx.prisma.pricingPlan.create({ data: { teacherId, ...plan } })
  return {
    ...res,
    amount: Number(res.amount),
  }
}
