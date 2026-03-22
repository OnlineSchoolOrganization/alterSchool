import type { MutationResolvers } from './../../../types.generated.js'
export const availabilitySlotDelete: NonNullable<MutationResolvers['availabilitySlotDelete']> = async (
  _parent,
  { slotId },
  ctx,
) => {
  await ctx.prisma.availabilitySlot.delete({
    where: { id: slotId }
  })

  return true
}
