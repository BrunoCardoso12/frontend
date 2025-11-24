import { ref, onMounted, onUnmounted } from 'vue'
import { getLoggedUser } from '@/composable/auth'
import { getUsers } from '@/services/apiRegisterUsers'
import { getConversation, sendMessage, getMessagesForUser } from '@/services/apiMessages'
import api from '@/services/api'
import { connectSocket, disconnectSocket, subscribeConversation, unsubscribeConversation } from '@/services/socket'
import { ref, onMounted, onUnmounted } from 'vue'
import { getLoggedUser } from '@/composable/auth'
import { getUsers } from '@/services/apiRegisterUsers'
import { getConversation, sendMessage, getMessagesForUser } from '@/services/apiMessages'
import api from '@/services/api'
import { connectSocket, disconnectSocket, subscribeConversation, unsubscribeConversation } from '@/services/socket'
<template>
  <v-row>
    <v-col cols="12" md="4">
      <v-card>
        <div color="primary">
          <v-toolbar class="pl-5" color="primary">Message</v-toolbar>
        </div>
        <v-list>
          <v-list-item
            v-for="u in users"
            :key="u.id"
            @click="selectUser(u)"
            :class="{ 'selected-user': selectedUser && selectedUser.id === u.id }"
          >
              <v-avatar size="40">
                <img :src="makeUserAvatar(u)" alt="avatar" />
              </v-avatar>
              <div style="padding-left: 12px;">
                <div class="text-subtitle-1">{{ u.username }}</div>
                <div class="text-caption">{{ lastMessageFor(u) }}</div>
              </div>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>

    <v-col cols="12" md="8">
      <v-card>
        <v-toolbar text color="primary">
          <v-toolbar-title>{{ selectedUser ? selectedUser.username : '' }}</v-toolbar-title>
        </v-toolbar>

        <v-card-text v-if="selectedUser" style="height: 60vh; overflow-y: auto;" ref="messagesContainer">
          <div v-for="m in messages" :key="m.id" :class="['message-row', m.senderId === me.id ? 'sent' : 'received']">
            <div class="message-bubble">{{ m.content }}</div>
            <div class="message-time">{{ formatTime(m.createdAt) }}</div>
          </div>
        </v-card-text>

        <v-card-actions v-if="selectedUser">
          <v-text-field v-model="newMessage" placeholder="Escreva uma mensagem..." @keyup.enter="send" class="flex-grow-1" />
          <v-btn color="secondary" @click="send">Enviar</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getLoggedUser } from '@/composable/auth'
import { getUsers } from '@/services/apiRegisterUsers'
import { getConversation, sendMessage, getMessagesForUser } from '@/services/apiMessages'
import api from '@/services/api'
import { connectSocket, disconnectSocket, subscribeConversation, unsubscribeConversation } from '@/services/socket'

interface User {
  id: number
  username: string
  avatarUrl?: string
}

interface Message {
  id: number
  senderId: number
  receiverId: number
  content: string
  createdAt: string
}

const me = getLoggedUser() as User || { id: null, username: '' }
const users = ref<User[]>([])
const selectedUser = ref<User | null>(null)
const messages = ref<Message[]>([])
const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)


async function loadUsers() {
  try {
    const all: User[] = await getUsers()
    users.value = all.filter((u: User) => u.id !== me.id)
  } catch (e) {
    console.warn('Could not load users', e)
  }
}

function formatTime(ts: string) {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleString()
}

function makeUserAvatar(u: User) {
  if (!u) return ''
  if (!u.avatarUrl) return ''
  const url = String(u.avatarUrl)
  if (/^https?:\/\//i.test(url)) return url
  const backendBase = api.defaults?.baseURL?.replace(/\/api\/?$/, '') || ''
  return url.startsWith('/') ? backendBase + url : backendBase + '/' + url
}

function lastMessageFor(u: User) {
  const conv = messages.value.filter((m: Message) => (m.senderId === u.id && m.receiverId === me.id) || (m.senderId === me.id && m.receiverId === u.id))
  if (!conv.length) return ''
  return conv?.[conv.length - 1]?.content ?? ''
}

async function selectUser(u: User) {
  selectedUser.value = u
  await loadConversation(u)
  if (me.id && u && u.id) {
    const a = Number(me.id)
    const b = Number(u.id)
    const conversationId = (a < b) ? `${a}_${b}` : `${b}_${a}`
    subscribeConversation(conversationId, (msg: Message) => {
      if (selectedUser.value && ((msg.senderId === me.id && msg.receiverId === selectedUser.value.id) || (msg.receiverId === me.id && msg.senderId === selectedUser.value.id))) {
        messages.value.push(msg)
        setTimeout(() => {
          try {
            if (messagesContainer.value) {
              messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight || 0
            }
          } catch (e) {}
        }, 50)
      }
    })
  }
}

async function loadConversation(u: User) {
  if (!me.id || !u || !u.id) return
  messages.value = await getConversation(me.id, u.id) as Message[]
  setTimeout(() => {
    try {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight || 0
      }
    } catch (e) {}
  }, 100)
}

async function send() {
  if (!newMessage.value || !selectedUser.value) return
  const payload = { senderId: me.id, receiverId: selectedUser.value.id, content: newMessage.value }
  try {
    const sent: Message = await sendMessage(payload)
    messages.value.push(sent)
    newMessage.value = ''
    setTimeout(() => {
      try {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight || 0
        }
      } catch (e) {}
    }, 50)
  } catch (e) {
    console.error('Could not send message', e)
    alert('Erro ao enviar mensagem')
  }
}

onMounted(async () => {
  await loadUsers()
  if (me.id) {
    try {
      const all: Message[] = await getMessagesForUser(me.id)
      messages.value = (all || []).reverse()
    } catch (e) {}
  }
  try {
    connectSocket((msg: Message)=>{
      if (selectedUser.value && ((msg.senderId === me.id && msg.receiverId === selectedUser.value.id) || (msg.receiverId === me.id && msg.senderId === selectedUser.value.id))) {
        messages.value.push(msg)
      }
    })
  } catch (e) { console.warn('Socket connect failed', e) }
})

onUnmounted(() => {
  try { unsubscribeConversation() } catch (e) {}
  try { disconnectSocket() } catch (e) {}
})
</script>

<style scoped>
.message-row { margin-bottom: 12px; display:flex; flex-direction:column; }
.message-row.sent { align-items: flex-end; }
.message-row.received { align-items: flex-start; }
.message-bubble { background: #e0f7fa; padding: 8px 12px; border-radius: 12px; max-width: 70%; }
.message-row.sent .message-bubble { background: #c8e6c9; }
.message-time { font-size: 0.75rem; color: #666; margin-top: 4px; }
.selected-user { background: rgba(0,0,0,0.04); }
</style>