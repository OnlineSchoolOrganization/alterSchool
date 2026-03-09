import { GraphQLError } from 'graphql'
import { prisma } from '../../../../prisma.js'
import type { MutationResolvers } from './../../../types.generated.js'
import bcrypt from 'bcrypt'

import { z } from 'zod'

const validate = z.object({
  email: z
    .string({ message: 'Email-ul este obligatoriu' })
    .email({ message: 'Email-ul nu este valid' })
    .max(255, { message: 'Email-ul trebuie să aibă maximum 255 caractere' }),

  password: z
    .string({ message: 'Parola este obligatorie' })
    .min(6, { message: 'Parola trebuie să aibă minim 6 caractere' })
    .max(255, { message: 'Parola trebuie să aibă maximum 255 caractere' }),
})
export const userSignIn: NonNullable<MutationResolvers['userSignIn']> = async (_parent, _arg, _ctx) => {
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
  const { email, password } = _arg

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new GraphQLError('Email-ul sau parola sunt incorecte')
  }

  if ((await bcrypt.compare(password, user.password)) === false) {
    throw new GraphQLError('Email-ul sau parola sunt incorecte')
  }
  const token = _ctx.encryptJWT(user)
  return token
}
