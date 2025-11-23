<template>
  <v-container class="mt-10">
    <v-row justify="center">
      <v-col cols="12" md="6" lg="4">
        <h1 class="text-h2 font-weight-bold text-center my-6">Bookgram</h1>

        <v-card class="pa-10 pb-4" elevation="8" rounded="lg">
          <div class="text-subtitle-1 text-medium mb-4">E-mail</div>

          <v-text-field
            v-model="email"
            density="compact"
            placeholder="Email address"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            class="mb-1"
          ></v-text-field>

          <div
            class="text-subtitle-1 text-medium d-flex align-center justify-space-between mb-2"
          >
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
            v-model="password"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            density="compact"
            placeholder="Enter your password"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            class="mb-6"
            @click:append-inner="visible = !visible"
          ></v-text-field>

          <v-btn color="blue" size="large" block class="mb-4" @click="apply">
            Log In
          </v-btn>
          <v-btn color="red" size="large" block class="mb-4" @click="$emit('close')">
            Fechar
          </v-btn>

          <v-alert :type="alertType" v-if="message" class="mb-4">
            {{ message }}
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser } from '@/services/apiLogin'
import { getUserById } from '@/services/apiRegisterUsers'
import api from '@/services/api'

const visible = ref(false)
const password = ref('')
const email = ref('')

const message = ref('')
const alertType = ref<'success' | 'error'>('success')

const emit = defineEmits(['close'])
const router = useRouter()

async function apply() {
  message.value = ''
  alertType.value = 'success'

  try {
    const res = await loginUser(email.value, password.value)

    console.log('Login bem-sucedido:', res)
    message.value = `Bem-vindo, ${res.username}!`
    alertType.value = 'success'

    try {
      if (res && !res.avatarUrl && res.id) {
        try {
          const full = await getUserById(res.id)
          Object.assign(res, full)
          console.log('Fetched full user after login:', full)
        } catch (e) {
          console.warn('Could not fetch full user after login', e)
        }
      }

      const apiBase = api.defaults?.baseURL || ''
      const backendBase = apiBase.replace(/\/api\/?$/, '')
      if (res && res.avatarUrl) {
        const avatar = String(res.avatarUrl)
        if (!/^https?:\/\//i.test(avatar)) {
          res.avatarUrl = avatar.startsWith('/') ? backendBase + avatar : backendBase + '/' + avatar
        }
      }
    } catch (e) {
      console.warn('Could not normalize/avatar fetch after login', e)
    }

  localStorage.setItem('user', JSON.stringify(res))
  localStorage.setItem('token', res.token)
  // notify other components that user data changed (avatar etc.)
  try { window.dispatchEvent(new CustomEvent('user-updated', { detail: res })) } catch (e) {}

    router.push('/startPage')

  } catch (error: any) {
    if (error.response) {
      console.error('Erro de login:', error.response.status, error.response.data)
      message.value = error.response.data
      alertType.value = 'error'
    } else {
      message.value = 'Erro de conexão com o servidor'
      alertType.value = 'error'
    }
  }
}
</script>
