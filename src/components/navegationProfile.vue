<template>
  <v-app-bar color="primary">
    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

    <v-toolbar-title>Profile</v-toolbar-title>

    <template v-if="$vuetify.display.mdAndUp">
      <v-btn icon="mdi-magnify" variant="text"></v-btn>
      <v-btn icon="mdi-filter" variant="text"></v-btn>
    </template>

    <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    :location="$vuetify.display.mobile ? 'bottom' : undefined"
    temporary
  >
    <v-list style="text-align: center">
      <v-list-item v-for="item in items" :key="item.value" @click="handleItemClick(item)">
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-main style="height: 500px"> </v-main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import registerBook from '@/components/registerBook.vue'

import { useDialog } from '@/composable/dialog.ts'

const { openDialog } = useDialog()

const router = useRouter()
const drawer = ref(false)

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
  drawer.value = false
  if (item.value === 'registerBook') {
    openDialog('registerBook')
  } else if (item.value === 'exit') {
    localStorage.removeItem('token')
    router.push('/')
  } else {
    router.push(`/${item.value}`)
  }
}
</script>
