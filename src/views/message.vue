<template>
  <v-app>
    <v-main class="background-startPage">
      <navegationProfile />

      <message-component />
      <v-dialog v-model="isProfileOpen" persistent>
        <profileComponent />
      </v-dialog>
      <v-dialog v-model="isNotificationsOpen" persistent>
        <notification-component />
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'

import messageComponent from '@/components/message.vue'
import navegationProfile from '@/components/navegationProfile.vue'
import profileComponent from '@/components/profile.vue'
import notificationComponent from '@/components/notification.vue'

import { useDialog } from '@/composable/dialog'

const { activeDialog, closeDialog } = useDialog()

const isProfileOpen = computed({
  get: () => activeDialog.value === 'profile',
  set: (val) => { if (!val) closeDialog() }
})

const isNotificationsOpen = computed({
  get: () => activeDialog.value === 'notifications',
  set: (val) => { if (!val) closeDialog() }
})
</script>
