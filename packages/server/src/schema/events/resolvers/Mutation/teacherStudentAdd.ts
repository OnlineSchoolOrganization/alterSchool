import { prisma } from '../../../../prisma.js'
import type { MutationResolvers } from './../../../types.generated.js'
import { GraphQLError } from 'graphql'

export const teacherStudentAdd: NonNullable<MutationResolvers['teacherStudentAdd']> = async (_parent, _arg, _ctx) => {
  if (_ctx.user == null) {
    throw new GraphQLError('Trebuie să fii autentificat', {
      extensions: {
        code: 'UNAUTHORIZED',
      },
    })
  }

  const profile = await prisma.profile.findUnique({
    where: { id: _arg.studentProfileId },
    include: { student: { include: { teachers: true } } },
  })

  if (profile == null || profile.deleted) {
    throw new GraphQLError('Profilul de elev nu a fost găsit', {
      extensions: {
        code: 'NOT_FOUND',
      },
    })
  }

  if (profile.userId !== _ctx.user.id && _ctx.user.role.includes('SUPER_USER') === false) {
    throw new GraphQLError('Nu ai permisiunea să folosești acest profil', {
      extensions: {
        code: 'FORBIDDEN',
      },
    })
  }

  if (profile.student == null) {
    throw new GraphQLError('Profilul selectat nu este un profil de elev', {
      extensions: {
        code: 'FORBIDDEN',
      },
    })
  }

  const teacher = await prisma.teacher.findUnique({
    where: { id: _arg.teacherId },
    include: { students: true },
  })

  if (teacher == null) {
    throw new GraphQLError('Profesorul nu a fost găsit', {
      extensions: {
        code: 'NOT_FOUND',
      },
    })
  }

  const isAlreadyConnected = teacher.students.some(student => student.id === profile.student?.id)
  if (isAlreadyConnected) {
    return teacher
  }

  return await prisma.teacher.update({
    where: { id: teacher.id },
    data: {
      students: {
        connect: { id: profile.student.id },
      },
    },
  })
}
