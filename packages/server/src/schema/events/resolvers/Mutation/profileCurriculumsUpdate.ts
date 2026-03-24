import type { MutationResolvers } from './../../../types.generated.js'
export const profileCurriculumsUpdate: NonNullable<MutationResolvers['profileCurriculumsUpdate']> = async (
  _parent,
  { profileId, curriculumIds },
  _ctx,
) => {
  await _ctx.prisma.profileCurriculum.deleteMany({
    where: { profileId },
  })

  await _ctx.prisma.profileCurriculum.createMany({
    data: curriculumIds.map(id => ({
      profileId,
      curriculumId: id,
    })),
  })

  const p = await _ctx.prisma.profile.findUnique({
    where: { id: profileId },
  })
  if(p) return p
  throw new Error("user not found in profile curriculums update")
}
