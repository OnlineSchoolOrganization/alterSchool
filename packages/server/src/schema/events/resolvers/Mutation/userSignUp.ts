import { prisma } from '../../../../prisma.js'
import type { MutationResolvers } from './../../../types.generated.js'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { GraphQLError } from 'graphql'

const validate = z.object({
  email: z
    .string({ message: 'Email-ul este obligatoriu' })
    .email({ message: 'Email-ul nu este valid' })
    .max(255, { message: 'Email-ul trebuie să aibă maximum 255 caractere' }),

  phoneNumber: z
    .string({ message: 'Numărul de telefon este obligatoriu' })
    .max(20, { message: 'Numărul de telefon trebuie să aibă maximum 20 caractere' })
    .regex(/^[0-9+ ]+$/, { message: 'Numărul de telefon conține caractere invalide' }),

  password: z
    .string({ message: 'Parola este obligatorie' })
    .min(6, { message: 'Parola trebuie să aibă minim 6 caractere' })
    .max(255, { message: 'Parola trebuie să aibă maximum 255 caractere' }),

  firstName: z
    .string({ message: 'Numele este obligatoriu' })
    .max(64, { message: 'Numele trebuie să aibă maximum 64 caractere' }),

  lastName: z
    .string({ message: 'Numele de familie este obligatoriu' })
    .max(64, { message: 'Numele de familie trebuie să aibă maximum 64 caractere' }),
})

export const userSignUp: NonNullable<MutationResolvers['userSignUp']> = async (_parent, _arg, _ctx) => {
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
  const { email, firstName, lastName, phoneNumber, password } = _arg
  const existingUserEmail = await prisma.user.findUnique({ where: { email } })
  if (existingUserEmail) {
    throw new GraphQLError('Email-ul este deja folosit', {
      extensions: {
        code: 'EXISTING_EMAIL',
        field: 'email',
      },
    })
  }
  const existingUserPhone = await prisma.user.findUnique({ where: { phoneNumber } })
  if (existingUserPhone) {
    throw new GraphQLError('Numarul de telefon este deja folosit', {
      extensions: {
        code: 'EXISTSING_PHONE',
        field: 'phoneNumber',
      },
    })
  }
  const newUser = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      phoneNumber,
      password: await bcrypt.hash(password, 10),
    },
  })
  return _ctx.encryptJWT(newUser)
}
