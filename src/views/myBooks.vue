<template>
  <v-app>
    <v-main class="background-startPage">
      <myBooksAdd :books="books" />
      <navegationProfile />
      <v-dialog v-model="isRegisterBookOpen" persistent>
        <registerBook @close="closeDialog" @book-registered="reloadBooks" />
      </v-dialog>
      <v-dialog v-model="isProfileOpen" persistent>
        <profile-component />
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useDialog } from '@/composable/dialog.ts'
import navegationProfile from '@/components/navegationProfile.vue'
import myBooksAdd from '@/components/myBooksAdd.vue'
import registerBook from '@/components/registerBook.vue'
import profileComponent from '@/components/profile.vue'
import { getMyBooks } from '@/services/apiBooks.ts'
import { getLoggedUser } from '@/composable/auth.ts'

const { activeDialog, closeDialog } = useDialog()
const books = ref([])

const isRegisterBookOpen = computed({
  get: () => activeDialog.value === 'registerBook',
  set: (val) => {
    if (!val) closeDialog()
  },
})

const isProfileOpen = computed({
  get: () => activeDialog.value === 'profile',
  set: (val) => { if (!val) closeDialog() }
})

function reloadBooks() {
  const user = getLoggedUser()
  if (user && user.id) {
    getMyBooks(user.id).then((data) => (books.value = data))
  }
}

onMounted(async () => {
  const user = getLoggedUser()
  if (user && user.id) {
    books.value = await getMyBooks(user.id)
  }
})

</script>

<style>
.background-startPage {
  position: relative;
  min-height: 100vh;
}
</style>
