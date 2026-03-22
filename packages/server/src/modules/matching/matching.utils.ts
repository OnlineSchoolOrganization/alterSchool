import { SlotId, AvailabilitySlot, PrismaAvailabilitySlot } from './matching.types'

const DayOfWeekMap: Record<string, number> = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4,
  SATURDAY: 5,
  SUNDAY: 6,
}

export function mapPrismaSlotToNumeric(slot: PrismaAvailabilitySlot): AvailabilitySlot {
  return {
    dayOfWeek: DayOfWeekMap[slot.dayOfWeek] || 0,
    startTime: slot.startTime,
  }
}

export function buildSlotSet(slots: AvailabilitySlot[]): Set<SlotId> {
  const set = new Set<SlotId>()
  for (const slot of slots) {
    const id = slot.dayOfWeek * 24 + slot.startTime / 60
    set.add(id)
  }
  return set
}

export function countOverlap(setA: Set<SlotId>, setB: Set<SlotId>): number {
  const intersection = new Set([...setA].filter(x => setB.has(x)))
  return intersection.size
}

export function countOverlapMultiple(baseSet: Set<SlotId>, sets: Set<SlotId>[]): number {
  let total = 0
  for (const s of sets) {
    total += countOverlap(baseSet, s)
  }
  return total
}
