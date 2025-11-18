<template>
  <v-app-bar app fixed color="secondary">
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

    <v-toolbar-title>{{userName}}</v-toolbar-title>

    <template v-if="$vuetify.display.mdAndUp">
      <v-btn icon="mdi-magnify" variant="text"></v-btn>
      <v-btn icon="mdi-filter" variant="text"></v-btn>
      <v-btn icon="mdi-theme-light-dark" @click="toggleTheme"></v-btn>
    </template>

    <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    :location="$vuetify.display.mobile ? 'bottom' : undefined"
    temporary
    color="primary"
  >
    <v-list
      style="text-align: center; border-radius: 13px; padding: 0; margin: 20px"
      bg-color="background"
    >
      <v-list-item
        v-for="item in items"
        :key="item.value"
        @click="handleItemClick(item)"
        :class="[
          'list-item-custom',
          item.value === 'exit' ? 'exit-item' : '',
          selected === item.value ? 'selected' : '',
        ]"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, inject, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { useDialog } from '@/composable/dialog.ts'
import { getLoggedUser, logout } from "@/composable/auth.ts"

const currentTheme = inject('currentTheme')
const { openDialog } = useDialog()
const router = useRouter()

const user = getLoggedUser()
const userName = user?.username ?? "Usuário"

const drawer = ref(false)
const route = useRoute()
const selected = ref('startPage')
const noSelectItems = ['exit', 'registerBook']

const items = [
  { title: 'Home', value: 'startPage', },
  { title: 'Cadastro de Livros', value: 'registerBook' },
  { title: 'Meus Livros', value: 'myBooks' },
  { title: 'Comunidade', value: 'Community' },
  { title: 'Mensagem', value: 'menssage' },
  { title: 'Doação', value: 'donation' },
  { title: 'Sair', value: 'exit' },
]

function handleItemClick(item) {
  if (!noSelectItems.includes(item.value)) {
    selectItem(item.value)
  }
  drawer.value = false

  if (item.value === 'registerBook') {
    openDialog('registerBook')
    return
  }

  if (item.value === 'myBooks'){
    router.push('/myBooks')
    return
  }

  if (item.value === 'exit') {
    logout()
    router.push('/')
    return
  }

  router.push(`/${item.value}`)
}

function toggleTheme() {
  currentTheme.value = currentTheme.value === 'lightTheme' ? 'darkTheme' : 'lightTheme'
}

function selectItem(value) {
  selected.value = value
}

onMounted(() => {
  if (route.name && items.find(i => i.value === route.name)) {
    selected.value = String(route.name)
  }
})

watch(() => route.name, (name) => {
  if (name && items.find(i => i.value === name)) {
    selected.value = String(name)
  }
})
</script>
<style scoped>
.list-item-custom {
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}
.list-item-custom.selected {
  background-color: #1976d2;
  color: white;
}

.list-item-custom.exit-item:hover {
  background-color: #b71c1c;
}
.list-item-custom:hover {
  background-color: #c7c3c388;
  color: black;
}
</style>