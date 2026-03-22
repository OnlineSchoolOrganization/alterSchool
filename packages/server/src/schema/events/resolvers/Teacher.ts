import { prisma } from '../../../prisma.js'
import type { TeacherResolvers } from './../../types.generated.js'
export const Teacher: TeacherResolvers = {
  students: async parent => {
    const data = await prisma.teacher.findUnique({
      where: { id: parent.id as string },
      include: { students: true },
    })
    if (!data) return []
    return data.students
  },
  profile: async parent => {
    return await prisma.profile.findUnique({ where: { id: parent.profileId as string } })
  },
  pricingPlans: async parent => {
    const plans = await prisma.pricingPlan.findMany({
      where: { teacherId: parent.id as string },
    })

    return plans.map(p => ({
      ...p,
      amount: Number(p.amount),
    }))
  },
  stats: async parent => {
    return await prisma.teacherStat.findMany({ where: { teacherId: parent.id as string } })
  },
  groups: async parent => {
    const groups = await prisma.group.findMany({ where: { teacherId: parent.id as string } })

    return groups.map(g => ({
      ...g,
      price: Number(g.price),
    }))
  },
}
