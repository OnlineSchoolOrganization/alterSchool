export type SlotId = number

export type StudentSlots = {
  id: string
  name: string
  slotSet: Set<SlotId>
}

export type GroupResult = {
  students: StudentSlots[]
  commonSlotIds: SlotId[]
}

export const toSlotId = (day: number, startTime: number) => day * 1440 + startTime

const intersectMany = (sets: Set<SlotId>[]): Set<SlotId> => {
  if (!sets.length) return new Set()
  return sets.reduce((acc, s) => new Set([...acc].filter(x => s.has(x))), new Set(sets[0]))
}

export function useGroupMaker() {
  const generateGroups = (
    students: StudentSlots[],
    teacherSlotSet: Set<SlotId>,
    requiredOverlap: number,
    maxStudents: number
  ): GroupResult[] => {
    const results: GroupResult[] = []
    const used = new Set<string>()

    const backtrack = (start: number, current: StudentSlots[]) => {
      if (current.length > maxStudents) return

      const setsToIntersect = current.map(s => s.slotSet)
      setsToIntersect.push(teacherSlotSet)

      const common = intersectMany(setsToIntersect)
      if (current.length >= 1 && common.size >= requiredOverlap) {
        results.push({
          students: [...current],
          commonSlotIds: [...common]
        })
      }

      for (let i = start; i < students.length; i++) {
        const s = students[i]
        if (!s || used.has(s.id)) continue

        current.push(s)
        backtrack(i + 1, current)
        current.pop()
      }
    }

    backtrack(0, [])

    results.sort((a, b) => {
      if (b.students.length !== a.students.length) return b.students.length - a.students.length
      return b.commonSlotIds.length - a.commonSlotIds.length
    })

    const final: GroupResult[] = []
    for (const g of results) {
      if (g.students.some(s => used.has(s.id))) continue
      g.students.forEach(s => used.add(s.id))
      final.push(g)
    }

    return final
  }

  return { generateGroups }
}