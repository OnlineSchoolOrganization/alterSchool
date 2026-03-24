import type { MutationResolvers } from './../../../types.generated.js'
export const createGroup: NonNullable<MutationResolvers['createGroup']> = async (_parent, { studentIds, name }, ctx) => {
  if(!ctx.user) {
    throw new Error("unauthorized")
  }
  const teacherProfile = await ctx.prisma.profile.findFirst({
    where: {
      userId: ctx.user.id,
      teacher: {
        isNot: null
      }
    },
    include: {
      teacher: true,
    }
  })
  if(!teacherProfile?.teacher?.id) {
    throw new Error("unauthorized")
  }
  const group = await ctx.prisma.group.create({
    data: {
      name,
      status: 'PENDING',
      price: 0,
      capacity: studentIds.length,
      teacherId: teacherProfile?.teacher?.id,

      students: {
        create: studentIds.map(studentId => ({
          student: {
            connect: { id: studentId }
          },
          status: 'APPROVED',
          joinedAt: new Date()
        }))
      },
    },
  })

  return {
    ...group,
    price: Number(group.price),
  }
}
