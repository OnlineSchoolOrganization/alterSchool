import { prisma } from '../../../prisma.js';
import type { TeacherResolvers } from './../../types.generated.js'
export const Teacher: TeacherResolvers = {
  students: async (parent) => {
    const data = await prisma.teacher.findUnique({
      where: { id: parent.id as string },
      include: { students: true },
    });
    if(!data) return [];
    return data.students;
  },
  profile: async (parent) => {
    return await prisma.profile.findUnique({ where: { id: parent.profileId as string } });
  }
}
