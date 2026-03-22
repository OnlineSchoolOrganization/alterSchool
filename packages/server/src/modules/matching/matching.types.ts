export type SlotId = number

export type PrismaAvailabilitySlot = {
  id: string
  profileId: string
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
  startTime: number
  duration: number
  createdAt: Date
  updatedAt: Date
}

export type AvailabilitySlot = {
  dayOfWeek: number
  startTime: number
}

export type MatchResult<T> = {
  item: T
  overlapCount: number
  overlapWithStudents: number
  score: number
}
