<template>
  <v-container class="mt-2">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
  <v-card elevation="8" class="pa-8 scrollable-card" title="User Registration">
          <v-container>
            <div style="display: flex; justify-content: center; padding: 20px;">
              <img v-if="photoUrl" :src="photoUrl" alt="Preview" class="avatar-preview" />
            </div>

            <v-file-input
              label="Foto de perfil"
              accept="image/*"
              capture="user"
              v-model="photo"
            ></v-file-input>

            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="first"
                  color="primary"
                  label="First name"
                  variant="underlined"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="last"
                  color="primary"
                  label="Last name"
                  variant="underlined"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="email"
                  color="primary"
                  label="Email"
                  type="email"
                  variant="underlined"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="password"
                  color="primary"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  variant="underlined"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-checkbox
                  class="customCheckbox"
                  v-model="terms"
                  color="red"
                  label="I agree to site terms and conditions"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-container>

          <v-divider class="my-4"></v-divider>

          <v-card-actions>
            <v-btn color="error" variant="text" @click="$emit('close')"> Fechar </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              class="bg-success"
              color="black"
              @click="save"
              :disabled="!terms || !first || !last || !email || !password"
            >
              Complete Registration
              <v-icon icon="mdi-chevron-right" end></v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { ref, onUnmounted, watch } from 'vue'
import { createUser } from '@/services/apiRegisterUsers'
import api from '@/services/api'

const emit = defineEmits(['close'])

const first = ref('')
const last = ref('')
const email = ref('')
const password = ref('')
const terms = ref(false)
const photo = ref(null)
const photoUrl = ref(null)
let lastObjectUrl = null

const message = ref('')
const alertType = ref('success')

async function save() {
  try {
    const user = {
      username: `${first.value} ${last.value}`,
      email: email.value,
      password: password.value,
    }

    const response = await createUser(user)
    message.value = `Usuário criado com sucesso! ID: ${response.id}`
    alertType.value = 'success'

    if (photo.value && response && response.id) {
      let file = Array.isArray(photo.value)
        ? photo.value.length
          ? photo.value[0]
          : null
        : photo.value
      if (file && file instanceof File) {
        try {
          const form = new FormData()
          form.append('file', file)
          const uploadResp = await api.post(`/users/${response.id}/avatar`, form)

          // debug: log upload response
          // eslint-disable-next-line no-console
          console.log('uploadResp', uploadResp && uploadResp.data)

          const returned = uploadResp?.data
          if (returned && returned.avatarUrl) {
            const apiBase = api.defaults?.baseURL || ''
            const backendBase = apiBase.replace(/\/api\/?$/, '')
            photoUrl.value = backendBase + returned.avatarUrl
            if (lastObjectUrl) {
              URL.revokeObjectURL(lastObjectUrl)
              lastObjectUrl = null
            }
            // if there's a logged user in localStorage, update its avatarUrl so UI reflects change
            try {
              const existing = localStorage.getItem('user')
              if (existing) {
                const parsed = JSON.parse(existing)
                parsed.avatarUrl = backendBase + returned.avatarUrl
                localStorage.setItem('user', JSON.stringify(parsed))
                  try { window.dispatchEvent(new CustomEvent('user-updated', { detail: parsed })) } catch (e) {}
              }
            } catch (e) {
              console.warn('Could not update localStorage user avatar', e)
            }
          }
        } catch (err) {
          console.error('Erro ao fazer upload do avatar', err)
        }
      }
    }

    first.value = ''
    last.value = ''
    email.value = ''
    password.value = ''
    terms.value = false
    photo.value = null

    emit('close')
  } catch (error) {
    console.error(error)
    message.value = error.response?.data?.message || 'Erro ao criar usuário.'
    alertType.value = 'error'
  }
}

watch(photo, (newVal, oldVal) => {
  if (lastObjectUrl) {
    try {
      URL.revokeObjectURL(lastObjectUrl)
    } catch (e) {
    }
    lastObjectUrl = null
  }

  if (!newVal) {
    photoUrl.value = null
    return
  }

  let file = Array.isArray(newVal) ? (newVal.length ? newVal[0] : null) : newVal
  if (!file || !(file instanceof File)) {
    if (newVal && newVal.file && newVal.file instanceof File) file = newVal.file
  }

  if (file && file instanceof File) {
    const url = URL.createObjectURL(file)
    photoUrl.value = url
    lastObjectUrl = url
  } else {
    photoUrl.value = null
  }
})

onUnmounted(() => {
  if (lastObjectUrl) {
    try {
      URL.revokeObjectURL(lastObjectUrl)
    } catch (e) {}
  }
})
</script>
<style scoped>
.avatar-preview {
  display: flex;
  width: 150px;
  height: 150px;
  border-radius: 100px;
}

.scrollable-card {
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.avatar-preview {
  object-fit: cover;
  margin-bottom: 8px;
}
</style>
