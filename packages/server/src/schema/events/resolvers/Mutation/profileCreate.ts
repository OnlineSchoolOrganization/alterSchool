import type { MutationResolvers } from './../../../types.generated.js'
import { prisma } from '../../../../prisma.js'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { GraphQLError } from 'graphql'

const availabilitySlotSchema = z.object({
  dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
  startTime: z
    .number()
    .min(0, 'Timpul nu poate fi mai mic ca 0 ore')
    .max(1440, 'Timpul nu poate fi mai mare ca 24 ore'),
  duration: z.number().positive().max(1440),
})

const validate = z.object({
  email: z
    .string({ message: 'Email-ul este obligatoriu' })
    .email({ message: 'Email-ul nu este valid' })
    .max(255, { message: 'Email-ul trebuie să aibă maximum 255 caractere' })
    .optional(),

  phoneNumber: z
    .string({ message: 'Numărul de telefon este obligatoriu' })
    .max(20, { message: 'Numărul de telefon trebuie să aibă maximum 20 caractere' })
    .regex(/^[0-9+ ]+$/, { message: 'Numărul de telefon conține caractere invalide' })
    .optional(),

  username: z
    .string({ message: 'Numele este obligatoriu' })
    .min(2, { message: "Numele trebuie sa aiba mai mult de 2 caractere" })
    .max(64, { message: 'Numele trebuie să aibă maximum 64 caractere' }),

  availabilitySlots: z.array(availabilitySlotSchema),
})

export const profileCreate: NonNullable<MutationResolvers['profileCreate']> = async (_parent, _arg, _ctx) => {
  if (!_ctx.user) {
    throw new GraphQLError('Unauthorized', {
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
  const { email, username, phoneNumber, availabilitySlots, type } = _arg
  /* Comment this section for now
  if (type == 'TEACHER') {
    const profile = await prisma.profile.create({
      data: {
        userId: _ctx.user.id,
        email,
        firstName,
        lastName,
        phoneNumber,
        availabilitySlots: {
          create: availabilitySlots.map(slot => ({
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            duration: slot.duration,
          })),
        },
        teacher: { create: {} },
      },
    })
    await prisma.user.update({
      where: { id: _ctx.user.id },
      data: {
        role: {
          push: 'TEACHER',
        },
      },
    })
    return profile
  }
  */
  const profile = await prisma.profile.create({
    data: {
      userId: _ctx.user.id,
      email,
      username,
      phoneNumber,
      availabilitySlots: {
        create: availabilitySlots.map(slot => ({
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          duration: slot.duration,
        })),
      },
      student: { create: {} },
    },
  })
  return profile
}
