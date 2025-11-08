<template>
  <v-app>
    <v-main class="background-startPage d-flex align-center justify-center">
    <navegationProfile />
    
      <!-- <v-row>
        <v-col> </v-col>
      </v-row> -->
    </v-main>
  </v-app>
</template>

<script>
import navegationProfile from '@/components/navegationProfile.vue'

export default {
  components: {
    navegationProfile,
  },
}
</script>
<style>
.background-startPage {
  background-image: url('@/assets/estante2.jpeg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 100vw;
  height: 80vh;
  margin: 0;
  margin-top: 70px;
  padding: 0;
}

</style>
