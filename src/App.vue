<template>
  <v-app :theme="currentTheme">
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, provide, watch } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()

const currentTheme = ref(localStorage.getItem('theme') || 'lightTheme')

theme.change(currentTheme.value)

watch(currentTheme, (val) => {
  localStorage.setItem('theme', val)
  theme.change(val)
})

provide("currentTheme", currentTheme)
</script>

<style scoped>
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>
