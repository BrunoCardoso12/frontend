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
    <!-- <img src="foto" alt=""> -->
    <v-list style="text-align: center;" :items="items"></v-list>
  </v-navigation-drawer>

  <v-main style="height: 500px"> </v-main>
</template>
<script setup>
import { ref, watch } from 'vue'

const items = [
  {
    title: 'Home',
    value: 'homeBook',
  },
  {
    title: 'Cadastro de Livros',
    value: 'resgisterBook',
  },
  {
    title: 'Meus Livros',
    value: 'myBook',
  },
  {
    title: 'Comunidade',
    value: 'Community',
  },
  {
    title: 'Mensagem',
    value: 'menssage',
  },
  {
    title: 'Doação',
    value: 'donation'
  },
  {
    title: 'Sair',
    value: 'exit'
  }
  
]

const drawer = ref(false)
const group = ref(null)

watch(group, () => {
  drawer.value = false
})
</script>
