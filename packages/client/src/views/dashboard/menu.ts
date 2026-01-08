import { computed, type ComputedRef } from 'vue'
import { type MeQuery } from '@/api/graphql'
import { useRoute } from 'vue-router'

type MenuItem = {
  name: string
  link: string
}

export type MenuCategory = {
  category: string
  items: MenuItem[]
}

export function useMenu(user: ComputedRef<MeQuery['me'] | undefined | null>) {
  const route = useRoute()

  const menu = computed<MenuCategory[]>(() => {
    const categories: MenuCategory[] = []

    if (user.value?.role?.includes('SUPER_USER')) {
      categories.push({
        category: 'super user',
        items: [{ name: 'Users', link: '/dashboard/users' }],
      })
    }

    const userId = (route.params.id as string) || ''
    const userLink = userId ? `/dashboard/user/${userId}` : '/dashboard/user'
    const testLink = userId ? `/dashboard/test/${userId}` : '/dashboard/test'

    categories.push({
      category: 'user',
      items: [
        { name: 'User', link: userLink },
        { name: 'Test', link: testLink },
      ],
    })

    return categories
  })

  return { menu }
}
