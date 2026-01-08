import { ref, watch } from 'vue'

type MenuItem = {
  name: string
  link: string
}

type Menu = {
  category: string
  items: MenuItem[]
}

const menu = ref<Menu[]>([
    {
        category: 'super user',
        items: []
    },
    {
        category: 'user',
        items: []
    }
])

export function useMenu() {
  function initBaseMenu() {
    if(menu.value[1]) menu.value[1].items = [
        { name: 'User', link: '/dashboard/user' },
    ]
  }

  function initSuMenu() {
    if(menu.value[0]) menu.value[0].items = [
      { name: 'Users', link: '/dashboard/users' },
    ]
  }

  function redefineSuMenu(id: string) {
    if(menu.value[1]) menu.value[1].items = [
      { name: 'User', link: '/dashboard/user/' + id },
    ]
  }

  return {
    menu,
    initSuMenu,
    initBaseMenu,
    redefineSuMenu,
  }
}
