<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { graphql } from '@/api'

import { useGroupMaker, type StudentSlots, type SlotId, toSlotId } from '@/composables/useGroupMaker'

import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

const DAYS = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'] as const

const requiredOverlap = ref(2)
const maxStudents = ref(4)
const selectedStudents = ref<string[]>([])
const generated = ref<any[]>([])

/** GRAPHQL QUERY */
const { result, loading, error } = useQuery(graphql(`
  query MeForGroup {
    me {
      profiles {
        roleProfile {
          __typename
          ... on Teacher {
            id
            profile {
            availabilitySlots {
            dayOfWeek
            startTime
            }
            }
            bio
            students {
              id
              profile {
                firstName
                username
                lastName
                availabilitySlots {
                  dayOfWeek
                  startTime
                }
              }
            }
            groups {
              id
              name
              status
              capacity
              memberships {
                status
                student {
                  id
                  profile {
                    username
                    firstName
                  }
                }
              }
              sessions {
                dayOfWeek
                startTime
              }
            }
          }
        }
      }
    }
  }
`))

/** GET TEACHER */
const teacher = computed(() => {
  const profiles = result.value?.me?.profiles
  if (!profiles) return null
  return profiles.map(p => p.roleProfile).find(r => r?.__typename === 'Teacher') ?? null
})

/** MAP STUDENTS -> StudentSlots */
const students = computed<StudentSlots[]>(() => {
  if (!teacher.value?.students) return []

  return teacher.value.students.map(s => {
    const slots = s.profile?.availabilitySlots ?? []
    return {
      id: s.id,
      name: `${s.profile?.username ?? ''}`,
      slotSet: new Set(
        slots.map(slot =>
          toSlotId(DAYS.indexOf(slot.dayOfWeek), slot.startTime)
        )
      )
    }
  })
})

/** EXISTING GROUP MEMBERS */
const groupedStudentIds = computed(() => {
  if (!teacher.value?.groups) return new Set<string>()
  return new Set(
    teacher.value.groups.flatMap(g => g.memberships?.map(m => m.student?.id))
  )
})

/** FREE STUDENTS */
const freeStudents = computed(() => students.value.filter(s => !groupedStudentIds.value.has(s.id)))

/** STATS */
const stats = computed(() => ({
  total: students.value.length,
  grouped: groupedStudentIds.value.size,
  free: freeStudents.value.length
}))

/** SELECT STUDENT */
const toggleStudent = (id: string) => {
  if (selectedStudents.value.includes(id)) {
    selectedStudents.value = selectedStudents.value.filter(x => x !== id)
  } else {
    selectedStudents.value.push(id)
  }
}

/** GROUP MAKER */
const { generateGroups } = useGroupMaker()

const run = () => {
    const students: StudentSlots[] = freeStudents.value.filter(s => selectedStudents.value.includes(s.id))
    const teacherSlotSet: Set<SlotId> = new Set(
    teacher.value?.profile?.availabilitySlots?.map(
        s => toSlotId(DAYS.indexOf(s.dayOfWeek), s.startTime)
    ) ?? []
    )

  generated.value = generateGroups(
    freeStudents.value,
    teacherSlotSet,
    requiredOverlap.value,
    maxStudents.value
  )
}

/** CREATE GROUP MUTATION */
const CREATE_GROUP = graphql(`
  mutation CreateGroup ($studentIds: [ID!]!) {
    createGroup(name: "Generated Group", studentIds: $studentIds) {
      id
    }
  }
`)
const { mutate } = useMutation(CREATE_GROUP)
const createGroup = async (ids: string[]) => await mutate({ studentIds: ids })

/** UTILITIES */
const formatTime = (minutes: number) => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`
}

const dayShort = (d: string) => d.slice(0, 3)
</script>

<template>
  <div v-if="loading" class="text-center py-10 text-zinc-400">Loading...</div>
  <div v-else-if="error" class="text-center py-10 text-red-500">Eroare la încărcare</div>

  <div v-else class="flex flex-col gap-10 w-full max-w-7xl mx-auto py-10">

    <!-- LEFT: Generator -->
    <div class="flex-1 flex flex-col gap-6">

      <!-- HEADER -->
      <div>
        <h1 class="text-3xl font-bold">Group Maker</h1>
        <p class="text-zinc-400 text-sm">Creează grupuri automat pe baza disponibilității</p>
      </div>

      <!-- STATS -->
      <div class="grid grid-cols-3 gap-4">
        <div class="p-4 bg-slate-800 rounded-lg shadow flex flex-col items-center justify-center">
          <div class="font-semibold">{{ stats.total }}</div>
          <div class="text-sm text-zinc-400">total</div>
        </div>
        <div class="p-4 bg-slate-800 rounded-lg shadow flex flex-col items-center justify-center">
          <div class="font-semibold">{{ stats.grouped }}</div>
          <div class="text-sm text-zinc-400">în grupuri</div>
        </div>
        <div class="p-4 bg-slate-800 rounded-lg shadow flex flex-col items-center justify-center">
          <div class="font-semibold">{{ stats.free }}</div>
          <div class="text-sm text-zinc-400">disponibili</div>
        </div>
      </div>

      <!-- SETTINGS -->
      <div class="flex flex-wrap gap-3 items-end">
        <Input
          id="overlap"
          label="overlap"
          placeholder="Overlap"
          :model-value="requiredOverlap?.toString()"
          @update:model-value="val => (requiredOverlap = Number(val))"
          type="number"
          class="flex-1"
        />
        <Input
            id="maxStudents"
            label="max students"
          placeholder="Max Students"
          :model-value="maxStudents?.toString()"
          @update:model-value="val => (maxStudents = Number(val))"
          type="number"
          class="flex-1"
        />
        <div>
            <Button class="btn ml-auto" @click="run">Generate</Button>
        </div>
      </div>

      <!-- STUDENTS AVAILABLE -->
      <div class="p-4 bg-slate-800 rounded-lg shadow">
        <h2 class="font-semibold mb-3">Elevi disponibili</h2>
        <div class="grid md:grid-cols-2 gap-2">
          <div
            v-for="s in freeStudents"
            :key="s.id"
            @click="toggleStudent(s.id)"
            class="p-2 rounded-lg cursor-pointer border border-transparent hover:border-emerald-500 transition-colors"
            :class="selectedStudents.includes(s.id) ? 'bg-emerald-400 border-emerald-500' : 'bg-slate-900'"
          >
            <div class="font-medium">{{ s.name }}</div>
            <div class="text-xs text-zinc-400">{{ s.slotSet.size }} sloturi</div>
          </div>
        </div>
      </div>

      <!-- GENERATED GROUPS -->
      <div class="p-4 bg-slate-800 rounded-lg shadow">
        <h2 class="font-semibold mb-3">Grupuri generate</h2>
        <div v-if="!generated.length" class="text-sm text-zinc-500">Nu ai generat nimic încă</div>
        <div class="flex gap-3">
          <div
            v-for="(g, i) in generated"
            :key="i"
            class="p-3 min-w-100 bg-slate-900 rounded-lg shadow flex flex-col gap-2 flex-wrap"
          >
            <div class="flex justify-between items-center">
              <div class="font-semibold">{{ g.students.length }} elevi</div>
              <div class="text-xs text-zinc-400">overlap: {{ g.commonSlotIds.length }}</div>
            </div>
            <div class="text-sm">
              <div v-for="s in g.students" :key="s.id">• {{ s.name }}</div>
            </div>
            <div>
                <Button class="mt-2" size="sm" @click="createGroup(g.students.map((s: {id: string}) => s.id))" disabled> Creează grup </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT: EXISTING GROUPS -->
    <div class="flex-1 flex flex-col gap-6">
      <div class="p-4 bg-slate-800 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-3">Grupuri existente</h2>
        <div class="flex flex-col gap-3">
          <div
            v-for="g in teacher?.groups"
            :key="g.id"
            class="p-3 bg-slate-900 rounded-lg shadow flex flex-col gap-2"
          >
            <div class="flex justify-between">
              <div class="font-semibold">{{ g.name }}</div>
              <div class="text-xs text-zinc-400">{{ g.status }}</div>
            </div>
            <div class="text-sm text-zinc-400">{{ g.memberships?.length }} / {{ g.capacity }} elevi</div>
            <div class="text-sm mt-1">
              <div v-for="m in g.memberships" :key="m.student?.id">• {{ m.student?.profile?.firstName }}</div>
            </div>
            <div class="flex gap-2 flex-wrap mt-2">
              <div v-for="s in g.sessions" :key="s.dayOfWeek + s.startTime" class="px-2 py-1 bg-slate-700 rounded text-xs">
                {{ dayShort(s.dayOfWeek) }} {{ formatTime(s.startTime) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Hover & selection for students */
.student-card.selected {
  background-color: #065f46; /* emerald-700 */
  border-color: #10b981; /* emerald-500 */
}
.group-card {
  border: 1px solid #334155; /* slate-700 */
}
</style>