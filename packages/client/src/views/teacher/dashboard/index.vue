<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { DayOfWeek, type GetTeacherQuery, type GetTeacherQueryVariables } from '@/api/graphql'
import { graphql } from '@/api'

import TeacherHero from '@/components/teacher/TeacherHero.vue'
import TeacherGroups from '@/components/teacher/TeacherGroups.vue'
import TeacherPricing from '@/components/teacher/TeacherPricing.vue'
import TimeSlots from '@/components/ui/availability/TimeSlots.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

import { GetTeacherDocument } from '@/api/graphql'

/* ================= GET TEACHER ================= */

const ME_QUERY = graphql(`
  query MeTeacherId {
    me {
      id
      profiles {
        id
        roleProfile {
          __typename
          ... on Teacher {
            id
          }
        }
      }
    }
  }
`)

const { result: meResult, loading: meLoading } = useQuery(ME_QUERY)

const teacherId = computed(() => {
  const profiles = meResult.value?.me?.profiles || []

  const teacherProfile = profiles.find(p => p.roleProfile?.__typename === 'Teacher')

  if (teacherProfile?.roleProfile?.__typename === 'Teacher') return teacherProfile?.roleProfile?.id || ''
  return ''
})

const { result, loading, error, refetch } = useQuery<GetTeacherQuery, GetTeacherQueryVariables>(
  GetTeacherDocument,
  () => ({
    teacherId: teacherId.value,
  }),
  () => ({
    enabled: !!teacherId.value,
  }),
)

const teacher = computed(() => result.value?.teacher ?? null)

/* ================= TYPES ================= */

type TeacherData = NonNullable<NonNullable<GetTeacherQuery['teacher']>>

/* ================= STATE ================= */

const teacherProfile = ref<TeacherData | null>(null)

watch(teacher, val => {
  if (!val) return

  teacherProfile.value = structuredClone(val)
})

/* ================= MUTATIONS ================= */

const TEACHER_PROFILE_UPDATE = graphql(`
  mutation TeacherProfileUpdate($profileId: ID!, $firstName: String, $username: String, $lastName: String) {
    profileUpdate(profileId: $profileId, username: $username, firstName: $firstName, lastName: $lastName) {
      id
    }
  }
`)

const TEACHER_BIO_UPDATE = graphql(`
  mutation TeacherBioUpdate($teacherId: ID!, $bio: String!) {
    teacherBioUpdate(teacherId: $teacherId, bio: $bio) {
      id
      bio
    }
  }
`)

const TEACHER_STAT_CREATE = graphql(`
  mutation TeacherStatCreate($teacherId: ID!, $stat: ITeacherStatCreate!) {
    teacherStatCreate(teacherId: $teacherId, stat: $stat) {
      id
      label
      value
    }
  }
`)

const TEACHER_STAT_UPDATE = graphql(`
  mutation TeacherStatUpdate($stat: ITeacherStatUpdate!) {
    teacherStatUpdate(stat: $stat) {
      id
      label
      value
    }
  }
`)

const TEACHER_STAT_DELETE = graphql(`
  mutation TeacherStatDelete($statId: ID!) {
    teacherStatDelete(statId: $statId)
  }
`)

const PLAN_CREATE = graphql(`
  mutation TeacherPricingPlanCreate($teacherId: ID!, $plan: IPricingPlanCreate!) {
    teacherPricingPlanCreate(teacherId: $teacherId, plan: $plan) {
      id
      type
      label
      amount
      benefits
    }
  }
`)

const PLAN_UPDATE = graphql(`
  mutation TeacherPricingPlanUpdate($plan: IPricingPlanUpdate!) {
    teacherPricingPlanUpdate(plan: $plan) {
      id
      type
      label
      amount
      benefits
    }
  }
`)

const PLAN_DELETE = graphql(`
  mutation TeacherPricingPlanDelete($planId: ID!) {
    teacherPricingPlanDelete(planId: $planId)
  }
`)

const SLOT_CREATE = graphql(`
  mutation SlotCreate($profileId: ID!, $slot: IAvailabilitySlot!) {
    availabilitySlotCreate(profileId: $profileId, slot: $slot) {
      id
      dayOfWeek
      startTime
      duration
    }
  }
`)

const SLOT_DELETE = graphql(`
  mutation SlotDelete($slotId: ID!) {
    availabilitySlotDelete(slotId: $slotId)
  }
`)

const { mutate: updateProfile } = useMutation(TEACHER_PROFILE_UPDATE)
const { mutate: updateBio } = useMutation(TEACHER_BIO_UPDATE)
const { mutate: statCreate } = useMutation(TEACHER_STAT_CREATE)
const { mutate: statUpdate } = useMutation(TEACHER_STAT_UPDATE)
const { mutate: statDelete } = useMutation(TEACHER_STAT_DELETE)
const { mutate: planCreate } = useMutation(PLAN_CREATE)
const { mutate: planUpdate } = useMutation(PLAN_UPDATE)
const { mutate: planDelete } = useMutation(PLAN_DELETE)
const { mutate: slotCreate } = useMutation(SLOT_CREATE)
const { mutate: slotDelete } = useMutation(SLOT_DELETE)

/* ================= ACTIONS ================= */

const saving = ref(false)

const saveProfileChanges = async () => {
  if (!teacherProfile.value) return

  saving.value = true

  try {
    const profile = teacherProfile.value

    /* PROFILE */
    if (profile.profile)
      await updateProfile({
        profileId: profile.profile.id,
        username: profile.profile.username,
        firstName: profile.profile.firstName || undefined,
        lastName: profile.profile.lastName || undefined,
      })

    /* BIO */
    await updateBio({
      teacherId: profile.id,
      bio: profile.bio || '',
    })

    /* STATS */
    for (const stat of profile.stats ?? []) {
      if (!stat.label || !stat.value) continue

      if (stat.id !== 'new') {
        await statUpdate({
          stat: {
            id: stat.id,
            label: stat.label,
            value: stat.value,
          },
        })
      } else {
        await statCreate({
          teacherId: profile.id,
          stat: {
            label: stat.label,
            value: stat.value,
          },
        })
      }
    }

    /* PLANS */
    for (const plan of profile.pricingPlans ?? []) {
      if (!plan.label || !plan.type) continue

      if (plan.id !== 'new') {
        await planUpdate({
          plan: {
            id: plan.id,
            amount: plan.amount,
            benefits: plan.benefits || [],
            label: plan.label,
            type: plan.type,
          },
        })
      } else {
        await planCreate({
          teacherId: profile.id,
          plan: {
            capacity: plan.capacity || 0,
            amount: plan.amount,
            benefits: plan.benefits || [],
            label: plan.label,
            type: plan.type,
          },
        })
      }
    }

    refetch()
  } catch (err) {
    console.error(err)
    alert('Eroare!')
  } finally {
    saving.value = false
  }
}

const toggleSlot = async (dayOfWeek: DayOfWeek, startTime: number) => {
  if (!teacherProfile.value?.profile) return

  const slots = teacherProfile.value.profile.availabilitySlots || []

  const existing = slots.find(s => s.dayOfWeek === dayOfWeek && s.startTime === startTime)

  if (existing) {
    await slotDelete({ slotId: existing.id })

    teacherProfile.value.profile.availabilitySlots = slots.filter(s => s.id !== existing.id)
  } else {
    const res = await slotCreate({
      profileId: teacherProfile.value.profile.id,
      slot: {
        dayOfWeek,
        startTime,
        duration: 60,
      },
    })

    if (res?.data?.availabilitySlotCreate) {
      teacherProfile.value.profile.availabilitySlots?.push(res.data.availabilitySlotCreate)
    }
  }
}

/* ================= HELPERS ================= */

const addStat = () => {
  if (teacherProfile.value?.stats)
    teacherProfile.value?.stats.push({
      id: 'new',
      label: '',
      value: '',
    })
}

const removeStat = async (index: number) => {
  let stat = null
  if (teacherProfile.value?.stats) stat = teacherProfile.value?.stats[index]
  if (!stat) return

  if (stat.id && stat.id !== 'new') {
    await statDelete({ statId: stat.id })
  }

  if (teacherProfile.value?.stats) teacherProfile.value?.stats.splice(index, 1)
}

const addPlan = () => {
  if (teacherProfile.value?.pricingPlans)
    teacherProfile.value?.pricingPlans.push({
      id: 'new',
      type: 'individual',
      capacity: 1,
      label: '',
      amount: 200,
      benefits: [],
    })
}

const removePlan = async (index: number) => {
  let plan = null
  if (teacherProfile.value?.pricingPlans) plan = teacherProfile.value?.pricingPlans[index]
  if (!plan) return

  if (plan.id && plan.id !== 'new') {
    await planDelete({ planId: plan.id })
  }

  if (teacherProfile.value?.pricingPlans) teacherProfile.value?.pricingPlans.splice(index, 1)
}
</script>

<template>
  <div v-if="loading || meLoading" class="text-center py-10 text-zinc-400">Loading...</div>

  <div v-else-if="error" class="text-center py-10 text-red-500">Eroare la încărcare</div>

  <div v-else-if="teacherProfile && teacherProfile.profile" class="flex justify-center w-full py-10">
    <div class="flex flex-col md:flex-row gap-10 w-full m-10 rounded-lg">
      <!-- EDITOR -->
      <div class="flex-1 flex flex-col gap-6">
        <div class="flex-1 flex flex-col gap-6">
          <h2 class="text-3xl font-bold">Editare Profil</h2>

          <div class="flex gap-4 flex-wrap justify-between">
            <Input
              label="Numele"
              id="profile_firstname"
              :model-value="teacherProfile.profile?.firstName ?? ''"
              @update:model-value="
                val => {
                  if (teacherProfile?.profile) teacherProfile.profile.firstName = val
                }
              "
            />

            <Input
              label="Numele de familie"
              id="profile_secondname"
              :model-value="teacherProfile.profile?.lastName ?? ''"
              @update:model-value="
                val => {
                  if (teacherProfile?.profile) teacherProfile.profile.lastName = val
                }
              "
            />
            <Input label="Username" id="profile_username" v-model="teacherProfile.profile.username" />
          </div>

          <textarea v-model="teacherProfile.bio" class="input h-24" placeholder="Bio" />

          <!-- STATS -->
          <div class="flex flex-col gap-3">
            <h3 class="text-xl font-semibold">Stats</h3>

            <div v-for="(stat, index) in teacherProfile.stats" :key="index" class="flex gap-2">
              <Input :id="index + 'stat_label'" v-model="stat.label" class="flex-1" placeholder="label" />
              <Input :id="index + 'stat_value'" v-model="stat.value" class="w-48" placeholder="value" />
              <button @click="removeStat(index)">❌</button>
            </div>

            <Button variant="secondary" @click="addStat">+ Stat</Button>
          </div>

          <!-- PLANS -->
          <div class="flex flex-col gap-4">
            <h3 class="text-xl font-semibold">Plans</h3>

            <div class="flex gap-3 flex-wrap">
              <div
                v-for="(plan, index) in teacherProfile.pricingPlans"
                :key="index"
                class="p-3 border rounded flex flex-col gap-4"
              >
                <Input :id="index + 'plan_label'" placeholder="Titlu" v-model="plan.label" />
                <Input :id="index + 'plan_type'" placeholder="Tipul" v-model="plan.type" />
                <Input
                  :id="index + 'plan_capacity'"
                  placeholder="Capacitatea"
                  :model-value="plan.capacity?.toString()"
                  @update:model-value="val => (plan.capacity = Number(val))"
                  type="number"
                />
                <Input
                  :id="index + 'plan_price'"
                  placeholder="Preț"
                  :model-value="plan.amount?.toString()"
                  @update:model-value="val => (plan.amount = Number(val))"
                  type="number"
                />

                <Input
                  :value="plan?.benefits?.join(',')"
                  @input="
                    (e: Event) => {
                      const target = e.target as HTMLInputElement
                      plan.benefits = target.value ? target.value.split(',') : []
                    }
                  "
                  :id="index + 'plan_benefits'"
                  placeholder="Beneficii (despartite prin virgula)"
                />

                <button @click="removePlan(index)">❌</button>
              </div>
            </div>
            <Button variant="secondary" @click="addPlan">+ Plan</Button>
          </div>
        </div>

        <TimeSlots :availabilitySlots="teacherProfile.profile.availabilitySlots" @toggle="toggleSlot" />

        <div>
          <Button @click="saveProfileChanges">
            {{ saving ? 'Saving...' : 'Save' }}
          </Button>
        </div>
      </div>

      <!-- PREVIEW -->
      <div class="flex-1 flex flex-col gap-6">
        <TeacherHero :teacherData="teacherProfile" :is-member="false" :join-loading="false" />
        <TeacherGroups :groups="teacherProfile.groups" />
        <TeacherPricing :plans="teacherProfile.pricingPlans" />
      </div>
    </div>
  </div>
  <div v-else class="text-center py-10 text-red-500">Forbidden - nu ai profil de teacher</div>
</template>

<style scoped>
.input {
  border: 1px solid #333;
  padding: 6px 10px;
  border-radius: 6px;
}
</style>
