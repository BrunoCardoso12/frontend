<template>
  <v-container class="mt-10">
    <v-row justify="center">
      <v-col cols="12" md="6" lg="4">
        <h1 class="text-h2 font-weight-bold text-center my-6">Bookgram</h1>

        <v-card class="pa-10 pb-4" elevation="8" rounded="lg">
          <div class="text-subtitle-1 text-medium mb-4">E-mail</div>

          <v-text-field
            density="compact"
            placeholder="Email address"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            class="mb-1"
          ></v-text-field>

          <div class="text-subtitle-1 text-medium d-flex align-center justify-space-between mb-2">
            Password
            <a
              class="text-caption text-decoration-none text-black"
              href="#"
              rel="noopener noreferrer"
              target="_blank"
            >
              Forgot login password?
            </a>
          </div>

          <v-text-field
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            density="compact"
            placeholder="Enter your password"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            class="mb-6"
            @click:append-inner="visible = !visible"
          ></v-text-field>

          <v-btn class="mb-4" color="blue" size="large" block> Log In </v-btn>

          <v-card-text class="text-center"> </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import StartPage from '@/views/startPage.vue'

const visible = ref(false)
</script>
