<template>
  <v-card class="pa-4 mx-auto" width="520">
    <v-card-title>Editar perfil</v-card-title>
    <v-card-text>
      <div class="d-flex flex-column align-center">
        <v-avatar size="120">
          <img :src="avatarPreviewUrl || avatarSrc || defaultAvatar" @error="avatarErrored = true" alt="avatar" />
        </v-avatar>

        <div class="mt-4 text-center">
          <div class="text-h6">{{ user?.username || 'Usuário' }}</div>
          <div class="text-subtitle-1">{{ user?.email || '' }}</div>
        </div>
      </div>

      <v-form class="mt-4">
        <v-file-input
          v-model="avatarFile"
          label="Alterar foto"
          accept="image/*"
          show-size
          @change="onAvatarSelected"
        />
        <v-text-field v-model="username" label="Nome" />
        <v-text-field v-model="emailField" label="E-mail" />
        <v-text-field v-model="passwordField" label="Nova senha" type="password" hint="Deixe vazio para manter a senha" />
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-btn text color="error" @click="onDelete">Excluir conta</v-btn>
      <v-spacer />
      <v-btn text color="primary" @click="close">Fechar</v-btn>
      <v-btn :loading="uploadingAvatar" text @click="uploadAvatar" v-if="avatarFile">Enviar foto</v-btn>
      <v-btn color="primary" @click="onSave">Salvar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { getLoggedUser, logout } from '@/composable/auth.ts'
import { getUserById, updateUser, deleteUser } from '@/services/apiRegisterUsers'
import { useDialog } from '@/composable/dialog.ts'
import { useRouter } from 'vue-router'

const { closeDialog } = useDialog()
const router = useRouter()

const user = ref(null)
const avatarErrored = ref(false)

const username = ref('')
const emailField = ref('')
const passwordField = ref('')
const avatarFile = ref(null)
const avatarPreviewUrl = ref(null)
let lastObjectUrl = null
const uploadingAvatar = ref(false)

async function loadUser() {
  const local = getLoggedUser()
  if (!local || !local.id) return
  try {
    user.value = await getUserById(local.id)
    username.value = user.value.username || ''
    emailField.value = user.value.email || ''
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Could not fetch user for profile', e)
  }
}

onMounted(loadUser)

const avatarSrc = computed(() => {
  const u = user.value
  if (!u || !u.avatarUrl) return ''
  const url = String(u.avatarUrl)
  if (/^https?:\/\//i.test(url)) return url
  const apiBase = api.defaults?.baseURL || ''
  const backendBase = apiBase.replace(/\/api\/?$/, '')
  return url.startsWith('/') ? backendBase + url : backendBase + '/' + url
})

const defaultAvatar = computed(() => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150'><rect fill='%23e0e0e0' width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='20' fill='%23666'>User</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
})

async function onSave() {
  const local = getLoggedUser()
  if (!local || !local.id) return
  const payload = {
    username: username.value,
    email: emailField.value,
  }
  if (passwordField.value && passwordField.value.length > 0) payload.password = passwordField.value

  try {
    const updated = await updateUser(local.id, payload)
    try {
      const existing = localStorage.getItem('user')
      if (existing) {
        const parsed = JSON.parse(existing)
        parsed.username = updated.username
        parsed.email = updated.email
        if (updated.avatarUrl) parsed.avatarUrl = updated.avatarUrl
        localStorage.setItem('user', JSON.stringify(parsed))
        try { window.dispatchEvent(new CustomEvent('user-updated', { detail: parsed })) } catch (e) {}
      }
      location.reload()
    } catch (e) {}
    user.value = updated
    passwordField.value = ''
    closeDialog()
  } catch (e) {
    console.error('Could not update user', e)
    alert('Erro ao atualizar perfil')
  }
}

function makeAbsoluteAvatar(returnedAvatarUrl) {
  if (!returnedAvatarUrl) return null
  const url = String(returnedAvatarUrl)
  if (/^https?:\/\//i.test(url)) return url
  const apiBase = api.defaults?.baseURL || ''
  const backendBase = apiBase.replace(/\/api\/?$/, '')
  return url.startsWith('/') ? backendBase + url : backendBase + '/' + url
}

async function uploadAvatar() {
  const local = getLoggedUser()
  if (!local || !local.id) return
  let file = avatarFile.value
  if (Array.isArray(file)) file = file.length ? file[0] : null
  if (!file) return
  try {
    uploadingAvatar.value = true
    const form = new FormData()
    form.append('file', file)
    const resp = await api.post(`/users/${local.id}/avatar`, form)
    const returned = resp?.data
    if (returned) {
      // update local user state
      user.value = returned
      // update localStorage with absolute avatarUrl for quick UI
      try {
        const existing = localStorage.getItem('user')
        if (existing) {
          const parsed = JSON.parse(existing)
          parsed.avatarUrl = makeAbsoluteAvatar(returned.avatarUrl)
          localStorage.setItem('user', JSON.stringify(parsed))
          try { window.dispatchEvent(new CustomEvent('user-updated', { detail: parsed })) } catch (e) {}
        }
      } catch (e) {}
      // clear preview object URL
      if (lastObjectUrl) {
        try { URL.revokeObjectURL(lastObjectUrl) } catch (e) {}
        lastObjectUrl = null
      }
      avatarFile.value = null
      avatarPreviewUrl.value = null
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Avatar upload failed', e)
    alert('Erro ao enviar imagem')
  } finally {
    uploadingAvatar.value = false
  }
}

function onAvatarSelected(newVal) {
  // revoke previous
  if (lastObjectUrl) {
    try { URL.revokeObjectURL(lastObjectUrl) } catch (e) {}
    lastObjectUrl = null
  }
  let file = newVal
  if (Array.isArray(file)) file = file.length ? file[0] : null
  if (!file) {
    avatarPreviewUrl.value = null
    return
  }
  const url = URL.createObjectURL(file)
  avatarPreviewUrl.value = url
  lastObjectUrl = url
}

async function onDelete() {
  const ok = window.confirm('Confirma exclusão da sua conta? Esta operação é irreversível.')
  if (!ok) return
  const local = getLoggedUser()
  if (!local || !local.id) return
  try {
    await deleteUser(local.id)
    logout()
    closeDialog()
    router.push('/')
  } catch (e) {
    console.error('Could not delete user', e)
    alert('Erro ao excluir conta')
  }
}

function close() {
  closeDialog()
}
</script>
