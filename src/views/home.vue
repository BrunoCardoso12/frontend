<template>
  <v-app>
    <v-main class="background d-flex align-center justify-center">
      <div class="text-center">
        <h1 class="text-h3 font-weight-bold mb-8 text-black">Bookgram</h1>

        <v-btn class="mb-4 mr-2" color="primary" size="large" @click="showLogin = true">
          Acessar
        </v-btn>

        <v-btn class="mb-4" color="success" size="large" @click="showRegister = true">
          Criar Conta
        </v-btn>

        <v-dialog v-model="showLogin">
          <Login @close="showLogin = false" />
        </v-dialog>

        <v-dialog v-model="showRegister">
          <Register @close="showRegister = false" />
        </v-dialog>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Login from '@/components/login.vue'
import Register from '@/components/registerUser.vue'

const showLogin = ref(false)
const showRegister = ref(false)
</script>

<style scoped>
.background {
  background-image: url('@/assets/home.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  min-height: 100vh;
}
</style>
