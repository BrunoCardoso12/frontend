<template>
  <v-app-bar app fixed color="secondary">
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

    <v-toolbar-title>Profile</v-toolbar-title>

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
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useDialog } from '@/composable/dialog.ts'

const currentTheme = inject('currentTheme')
const { openDialog } = useDialog()
const router = useRouter()

const drawer = ref(false)
const selected = ref('startPage')
const noSelectItems = ['exit', 'registerBook']

const items = [
  { title: 'Home', value: 'startPage' },
  { title: 'Cadastro de Livros', value: 'registerBook' },
  { title: 'Meus Livros', value: 'myBook' },
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

  if (item.value === 'exit') {
    localStorage.removeItem('token')
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
</script>
<style scoped>
.list-item-custom {
  transition: 0.2s ease;
  border-radius: 8px;
}

.selected {
  background-color: rgba(98, 159, 252, 1);
  color: black !important;
}

.list-item-custom:hover {
  background-color: rgba(6, 241, 65, 0.897);
}

.exit-item:hover {
  background-color: rgba(250, 16, 16, 1) !important;
}
</style>
