<template>
  <v-app>
    <books />
    <v-main class="background-startPage d-flex align-center justify-center">
      <navegationProfile />
    </v-main>
  </v-app>
</template>

<script>
import navegationProfile from '@/components/navegationProfile.vue'
import books from '@/components/books.vue'

export default {
  components: {
    navegationProfile,
    books,
  },
}
</script>
<style>
.cards {
  display: flex;
  justify-content: center;
}
</style>
