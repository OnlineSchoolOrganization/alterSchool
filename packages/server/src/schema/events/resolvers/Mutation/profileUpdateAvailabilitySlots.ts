import type { MutationResolvers } from './../../../types.generated.js'
import { z } from 'zod'
import { GraphQLError } from 'graphql'
import { prisma } from '../../../../prisma.js'

const availabilitySlotSchema = z.object({
  dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
  startTime: z
    .number()
    .min(0, 'Timpul nu poate fi mai mic ca 0 ore')
    .max(1440, 'Timpul nu poate fi mai mare ca 24 ore'),
  duration: z.number().positive().max(1440),
})

const validate = z.object({
  profileId: z.string({ message: 'ID-ul profilului este obligatoriu' }),
  availabilitySlots: z.array(availabilitySlotSchema),
})
export const profileUpdateAvailabilitySlots: NonNullable<MutationResolvers['profileUpdateAvailabilitySlots']> = async (
  _parent,
  _arg,
  _ctx,
) => {
  try {
    validate.parse(_arg)
  } catch (e) {
    if (e instanceof z.ZodError) {
      const firstError = e.issues[0]
      if (!firstError) throw e
      throw new GraphQLError(firstError.message, {
        extensions: {
          code: firstError.code,
          field: firstError.path[0]?.toString(),
        },
      })
    }
    throw e
  }
  const { profileId, availabilitySlots } = _arg
  const profile = await prisma.profile.update({
    where: {
      id: profileId
    },
    data: {
      availabilitySlots: {
        create: availabilitySlots.map(slot => ({
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          duration: slot.duration,
        })),
      },
    },
  })
  return profile
}
