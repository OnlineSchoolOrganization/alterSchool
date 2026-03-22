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
  firstName: z
    .string({ message: 'Prenumele trebuie să fie text' })
    .trim()
    .max(64, { message: 'Prenumele trebuie să aibă maximum 64 caractere' })
    .optional(),
  lastName: z
    .string({ message: 'Numele trebuie să fie text' })
    .trim()
    .max(64, { message: 'Numele trebuie să aibă maximum 64 caractere' })
    .optional(),
  email: z
    .string({ message: 'Email-ul trebuie să fie text' })
    .trim()
    .email({ message: 'Email-ul nu este valid' })
    .max(255, { message: 'Email-ul trebuie să aibă maximum 255 caractere' })
    .optional(),
  phoneNumber: z
    .string({ message: 'Numărul de telefon trebuie să fie text' })
    .trim()
    .max(20, { message: 'Numărul de telefon trebuie să aibă maximum 20 caractere' })
    .regex(/^[0-9+ ]+$/, { message: 'Numărul de telefon conține caractere invalide' })
    .optional(),
  availabilitySlots: z.array(availabilitySlotSchema),
})

function normalizeOptionalString(value?: string | null) {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

export const profileUpdate: NonNullable<MutationResolvers['profileUpdate']> = async (_parent, { profileId, email, firstName, lastName, phoneNumber, username }, ctx) => {
  return await ctx.prisma.profile.update({
    where: { id: profileId},
    data: {
      ...(email && { email }),
      ...(firstName && { firstName}),
      ...(lastName && { lastName}),
      ...(phoneNumber && { phoneNumber}),
      ...(username && { username}),
    },
  })
}
