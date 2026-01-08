import { prisma } from '../../../../prisma.js'
import type { MutationResolvers } from './../../../types.generated.js'
export const teacherAdd: NonNullable<MutationResolvers['teacherAdd']> = async (_parent, _arg, _ctx) => {
  if (!_ctx.user || !_ctx.user.role.includes('SUPER_USER')) {
    throw new Error('Unauthorized')
  }
  const user = await prisma.user.findUnique({
    where: { id: _arg.userId },
    include: { profiles: { include: { teacher: true } } },
  })
  if (!user) {
    throw new Error('User not found')
  }
  if (user.profiles.some(s => s.teacher && !s.deleted)) {
    throw new Error('User is already a teacher')
  }
  const profile = await prisma.profile.create({
    data: {
      userId: _arg.userId,
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phoneNumber: user.phoneNumber || '',
      teacher: { create: {} },
    },
  })
  if (!user.role.includes('TEACHER'))
    await prisma.user.update({
      where: { id: _arg.userId },
      data: {
        role: {
          push: 'TEACHER',
        },
      },
    })
  return profile
}
