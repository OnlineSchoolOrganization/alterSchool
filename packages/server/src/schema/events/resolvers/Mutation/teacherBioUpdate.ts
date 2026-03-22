import type { MutationResolvers } from './../../../types.generated.js'
export const teacherBioUpdate: NonNullable<MutationResolvers['teacherBioUpdate']> = async (_parent, arg, ctx) => {
 const { teacherId, bio } = arg
  return ctx.prisma.teacher.update({
    where: { id: teacherId },
    data: { bio },
  })
}
