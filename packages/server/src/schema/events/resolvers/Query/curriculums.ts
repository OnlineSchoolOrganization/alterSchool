import { prisma } from '../../../../prisma.js'
import type { QueryResolvers } from './../../../types.generated.js'
export const curriculums: NonNullable<QueryResolvers['curriculums']> = async (_parent, _arg, _ctx) => {
  return await prisma.curriculum.findMany()
}
