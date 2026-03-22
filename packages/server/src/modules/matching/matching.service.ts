import { PrismaAvailabilitySlot, MatchResult, AvailabilitySlot } from './matching.types'
import { buildSlotSet, countOverlap, countOverlapMultiple, mapPrismaSlotToNumeric } from './matching.utils'

export function rankTeachersWithStudents<T>(
  studentSlotsPrisma: PrismaAvailabilitySlot[],
  candidates: {
    item: T
    teacherSlotsPrisma: PrismaAvailabilitySlot[]
    studentsSlotsPrisma?: PrismaAvailabilitySlot[][]
  }[],
): MatchResult<T>[] {
  const baseSlots: AvailabilitySlot[] = studentSlotsPrisma.map(mapPrismaSlotToNumeric)
  const baseSet = buildSlotSet(baseSlots)

  return candidates
    .map(({ item, teacherSlotsPrisma, studentsSlotsPrisma = [] }) => {
      const teacherSlots: AvailabilitySlot[] = teacherSlotsPrisma.map(mapPrismaSlotToNumeric)
      const teacherSet = buildSlotSet(teacherSlots)

      const overlapCount = countOverlap(baseSet, teacherSet)

      const studentSets = studentsSlotsPrisma.map(slots => buildSlotSet(slots.map(mapPrismaSlotToNumeric)))
      const overlapWithStudents = countOverlapMultiple(baseSet.intersection(teacherSet), studentSets)

      const score = overlapCount * 10 + overlapWithStudents

      return { item, overlapCount, overlapWithStudents, score }
    })
    .sort((a, b) => b.score - a.score)
}
