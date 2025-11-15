<template>
  <div class="pa-4 text-center">
    <v-btn text="Open Dialog 1" @click="dialog = true"></v-btn>

    <!-- Dialog 1 -->
    <v-dialog v-model="dialog" max-width="480">
      <v-card>
        <v-card-title class="justify-center">Dialog 1</v-card-title>
        <v-card-text class="text-center">
          <v-btn class="my-2" text="Open Dialog 2" @click="dialog2 = true"></v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Close" variant="text" @click="dialog = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog 2 -->
    <v-dialog v-model="dialog2" max-width="360">
      <v-card>
        <v-card-title class="justify-center">Dialog 2</v-card-title>
        <v-card-text class="text-center">
          <v-btn class="my-2" text="Open Dialog 3" @click="dialog3 = !dialog3"></v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Close" variant="text" @click="dialog2 = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog 3 -->
    <v-dialog v-model="dialog3" max-width="300">
      <v-card>
        <v-card-title class="justify-center">Dialog 3</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Close" variant="text" @click="dialog3 = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTopicsByBookId } from '@/services/apiTopics.ts'

const topics = ref([])
const dialog = ref(false)
const dialog2 = ref(false)
const dialog3 = ref(false)

// Exemplo de uso com um bookId específico
const bookId = 1

onMounted(async () => {
  try {
    topics.value = await getTopicsByBookId(bookId)
  } catch (err) {
    console.error('Erro ao buscar tópicos:', err)
  }
})
</script>

