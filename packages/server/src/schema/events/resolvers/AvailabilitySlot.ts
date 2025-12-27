import { prisma } from '../../../prisma.js'
import type { AvailabilitySlot as IAvailabilitySlot, AvailabilitySlotResolvers } from './../../types.generated.js'
export const AvailabilitySlot: AvailabilitySlotResolvers = {
  profile: async (parent: IAvailabilitySlot) => {
    return await prisma.profile.findUnique({ where: { id: parent.profileId as string } })
  },
}
