import type { MutationResolvers } from './../../../types.generated.js'
export const studentEducationUpdate: NonNullable<MutationResolvers['studentEducationUpdate']> = async (
  _parent,
  { profileId, data },
  _ctx,
) => {
  return _ctx.prisma.student.update({
    where: { profileId },
    data: {
      grade: data.grade,
      educationType: data.educationType,
    },
  })
}
