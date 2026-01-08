import { prisma } from '../../../../prisma.js'
import type { MutationResolvers, Profile } from './../../../types.generated.js'
export const teacherRemove: NonNullable<MutationResolvers['teacherRemove']> = async (_parent, _arg, _ctx) => {
  if (!_ctx.user?.role.includes('SUPER_USER')) {
    throw new Error('Unauthorized')
  }
  const user = await prisma.user.findUnique({
    where: { id: _arg.userId },
    include: { profiles: { include: { teacher: true } } },
  })
  if (!user) {
    throw new Error('User not found')
  }
  const teacherProfile = user.profiles.find(p => p.teacher && !p.deleted)
  if (!teacherProfile) {
    throw new Error('User is not a teacher')
  }
  const profile = await prisma.profile.update({
    where: {
      id: teacherProfile.id,
    },
    data: {
      deleted: true,
    },
  })
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      role: {
        set: user.role.filter(r => r !== 'TEACHER'),
      },
    },
  })
  return profile
}
