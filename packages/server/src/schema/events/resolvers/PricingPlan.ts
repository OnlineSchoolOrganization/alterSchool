import type { PricingPlanResolvers } from './../../types.generated.js'
export const PricingPlan: PricingPlanResolvers = {
  amount: parent => Number(parent.amount),
}
