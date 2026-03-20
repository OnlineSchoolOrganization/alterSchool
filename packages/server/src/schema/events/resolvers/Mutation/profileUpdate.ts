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

export const profileUpdate: NonNullable<MutationResolvers['profileUpdate']> = async (_parent, _arg, _ctx) => {
  if (!_ctx.user) {
    throw new GraphQLError('Trebuie să fii autentificat', {
      extensions: {
        code: 'UNAUTHORIZED',
      },
    })
  }

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

  const profile = await prisma.profile.findUnique({
    where: { id: _arg.profileId },
  })

  if (!profile || profile.deleted) {
    throw new GraphQLError('Profilul nu a fost găsit', {
      extensions: {
        code: 'NOT_FOUND',
      },
    })
  }

  const canEditProfile = profile.userId === _ctx.user.id || _ctx.user.role.includes('SUPER_USER')
  if (!canEditProfile) {
    throw new GraphQLError('Nu ai permisiunea să editezi acest profil', {
      extensions: {
        code: 'FORBIDDEN',
      },
    })
  }

  const firstName = normalizeOptionalString(_arg.firstName)
  const lastName = normalizeOptionalString(_arg.lastName)
  const email = normalizeOptionalString(_arg.email)
  const phoneNumber = normalizeOptionalString(_arg.phoneNumber)
  const username = [firstName, lastName].filter(Boolean).join(' ').trim() || profile.username

  return await prisma.$transaction(async tx => {
    await tx.availabilitySlot.deleteMany({
      where: { profileId: profile.id },
    })

    return await tx.profile.update({
      where: { id: profile.id },
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        username,
        availabilitySlots: {
          create: _arg.availabilitySlots.map(slot => ({
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            duration: slot.duration,
          })),
        },
      },
    })
  })
}
