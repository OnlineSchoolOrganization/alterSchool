import type { MutationResolvers } from './../../../types.generated.js'
export const availabilitySlotCreate: NonNullable<MutationResolvers['availabilitySlotCreate']> = async (
  _parent,
  { profileId, slot },
  ctx,
) => {
  return ctx.prisma.availabilitySlot.create({
    data: {
      profileId,
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      duration: slot.duration
    }
  })
}
