import { prisma } from '../../../prisma.js'
import type { StudentResolvers } from './../../types.generated.js'
export const Student: StudentResolvers = {
  teachers: async parent => {
    const data = await prisma.student.findUnique({
      where: { id: parent.id as string },
      include: { teachers: true },
    })
    if (!data) return []
    return data.teachers
  },
  profile: async parent => {
    return await prisma.profile.findUnique({ where: { id: parent.profileId as string } })
  },
}
