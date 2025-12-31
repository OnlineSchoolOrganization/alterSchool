import { prisma } from '../../../../prisma.js'
import type { QueryResolvers } from './../../../types.generated.js'
export const teachers: NonNullable<QueryResolvers['teachers']> = async (_parent, _arg, _ctx) => {
  return await prisma.teacher.findMany()
}
