<script setup lang="ts">
import { computed, ref } from 'vue'
import TeacherHero from '@/components/teacher/TeacherHero.vue'
import TeacherGroups from '@/components/teacher/TeacherGroups.vue'
import TeacherPricing from '@/components/teacher/TeacherPricing.vue'
import { useRoute } from 'vue-router'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { GetTeacherDocument } from '@/api/graphql'
import { graphql } from '@/api'

const route = useRoute()
const teacherId = computed(() => {
  const id = route.params.id
  return Array.isArray(id) ? id[0] : id
})

const { result, loading } = useQuery(
  GetTeacherDocument,
  () => ({
    teacherId: teacherId.value as string
  }),
  () => ({
    enabled: !!teacherId.value
  })
)

const teacher = computed(() => {
  if (!result.value) return null
  return result.value.teacher
})


const GET_TEACHER_STUDENTS = graphql(`
query GetTeacherStudents($teacherId: ID!) {
  teacher(teacherId: $teacherId) {
    students {
      profile {
        id
      }
    }
  }
}
`)

const { result: resultStudents, loading: loadingStudents, refetch } = useQuery(
  GET_TEACHER_STUDENTS,
  () => ({
    teacherId: teacherId.value as string
  }),
  () => ({
    enabled: !!teacherId.value
  })
)

const students = computed<string[]>(() => {
  if (!resultStudents.value) return []

  return resultStudents.value.teacher.students
    ?.map((s: any) => s?.profile?.id)
    .filter((id): id is string => !!id) || []
})

const selectedProfileId = ref(typeof window === 'undefined' ? '' : (localStorage.getItem('profileId') ?? ''))
const isMember = computed(() => {
  if (!selectedProfileId.value) return false

  return students.value.some(
    (s: string) => s === selectedProfileId.value
  )
})

const TEACHER_STUDENT_ADD = graphql(`
mutation TeacherStudentAdd($teacherId: ID!, $studentProfileId: ID!) {
  teacherStudentAdd(teacherId: $teacherId, studentProfileId: $studentProfileId) {
    id
  }
}
`)
const { mutate: joinTeacher, loading: joinLoading } = useMutation(TEACHER_STUDENT_ADD)

async function join() {
  if (!teacherId.value || !selectedProfileId.value) return

  if (isMember.value) return

  try {
    await joinTeacher({
      teacherId: teacherId.value,
      studentProfileId: selectedProfileId.value
    })

    await refetch()
  } catch (err) {
    console.error(err)
  }
}

</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else class="flex justify-center w-full">
    <div
      class="flex flex-col gap-16 w-full max-w-6xl m-3 my-10 p-10 border-slate-800 rounded-lg"
    >
      <TeacherHero
        :isMember="isMember"
        :joinLoading="joinLoading || loadingStudents"
        @join="join"
        :teacherData="teacher"
      />

      <TeacherGroups :groups="teacher?.groups" />

      <TeacherPricing :plans="teacher?.pricingPlans" />
    </div>
  </div>
</template>
