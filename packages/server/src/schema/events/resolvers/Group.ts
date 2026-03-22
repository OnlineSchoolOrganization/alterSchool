import { prisma } from '../../../prisma.js'
import type { GroupResolvers } from './../../types.generated.js'
export const Group: GroupResolvers = {
  teacher: async parent => {
    return await prisma.teacher.findUniqueOrThrow({ where: { id: parent.teacherId as string } })
  }
}
