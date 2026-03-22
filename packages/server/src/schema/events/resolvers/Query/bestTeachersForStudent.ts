import { rankTeachersWithStudents } from '../../../../modules/matching/matching.service'

import type { QueryResolvers } from './../../../types.generated.js'
export const bestTeachersForStudent: NonNullable<QueryResolvers['bestTeachersForStudent']> = async (
  _parent,
  { profileId },
  ctx,
) => {
  const prisma = ctx.prisma

  let studentProfile = ctx.user
    ? await prisma.profile.findUnique({
        where: { id: profileId },
        include: { availabilitySlots: true },
      })
    : null

  const teachers = await prisma.teacher.findMany({
    include: {
      profile: { include: { availabilitySlots: true } },
      students: {
        include: { profile: { include: { availabilitySlots: true } } },
      },
    },
  })

  const ranked = rankTeachersWithStudents(
    studentProfile?.availabilitySlots || [],
    teachers.map(t => ({
      item: t,
      teacherSlotsPrisma: t.profile?.availabilitySlots || [],
      studentsSlotsPrisma: t.students
        .filter(s => s.profile.id != profileId)
        .map(s => s.profile?.availabilitySlots || []),
    })),
  )

  return ranked.map(r => ({
    teacher: r.item,
    overlapCount: r.overlapCount,
    overlapWithStudents: r.overlapWithStudents,
    score: r.score,
  }))
}
