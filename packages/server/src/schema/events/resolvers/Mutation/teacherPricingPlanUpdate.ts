import type { MutationResolvers } from './../../../types.generated.js'
export const teacherPricingPlanUpdate: NonNullable<MutationResolvers['teacherPricingPlanUpdate']> = async (
  _parent,
  { plan },
  ctx,
) => {
  const res = await ctx.prisma.pricingPlan.update({
    where: { id: plan.id },
    data: {
      ...(plan.type && { type: plan.type }),
      ...(plan.label && { label: plan.label }),
      ...(plan.amount && { amount: plan.amount }),
      ...(plan.benefits && { benefits: plan.benefits }),
      ...(plan.capacity && { capacity: plan.capacity}),
    },
  })
  return {
    ...res,
    amount: Number(res.amount),
  }
}
