import { prisma } from '../../../prisma'
import type { ProfileResolvers } from './../../types.generated.js'
export const Profile: ProfileResolvers = {
  roleProfile: async parent => {
    const profile = await prisma.profile.findUnique({
      where: { id: parent.id as string },
      include: {
        teacher: true,
        student: true,
      },
    })

    if (!profile) throw new Error('Profile not found')

    if (profile.teacher) {
      return {
        __typename: 'Teacher',
        ...profile.teacher,
      }
    }
    if (profile.student) {
      return {
        __typename: 'Student',
        ...profile.student,
      }
    }

    throw new Error('Profile has no associated details')
  },
  user: async parent => {
    return await prisma.user.findUnique({ where: { id: parent.userId as string } })
  },
  availabilitySlots: async parent => {
    return await prisma.availabilitySlot.findMany({ where: { profileId: parent.id as string } })
  },
}
