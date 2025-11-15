<template>
  <v-container fluid class="py-10">
    <v-row class="d-flex justify-center align-start" dense>
      <v-col
        v-for="(book, index) in books"
        :key="book.id || index"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="d-flex justify-center"
      >
        <v-card class="mx-auto elevation-4" max-width="260">
          <v-img height="200" :src="book.coverImageUrl || '/default-cover.png'" cover></v-img>

          <v-card-title>{{ book.title }}</v-card-title>
          <v-card-subtitle>{{ book.author }}</v-card-subtitle>

          <v-card-actions>
            <bookTopicsDialog
              v-model:modelValue="showDialog"
              :book="selectedBook"
              :topics="topics"
            />

            <v-btn color="orange-lighten-2" @click="openExplore(book)"> Explore </v-btn>

            <v-spacer></v-spacer>
            <v-btn
              :icon="book.show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              @click="book.show = !book.show"
            ></v-btn>
          </v-card-actions>

          <v-expand-transition>
            <div v-show="book.show">
              <v-divider></v-divider>
              <v-card-text>{{ book.description }}</v-card-text>
            </div>
          </v-expand-transition>
        </v-card>

        <!-- Dialog -->
        <v-dialog v-model="showDialog" max-width="600">
          <v-card>
            <v-card-title>
              Tópicos de {{ selectedBook?.title }}
              <v-spacer></v-spacer>
              <v-btn icon @click="showDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-expansion-panels>
                <v-expansion-panel v-for="topic in topics" :key="topic.id" :title="topic.title">
                  <v-card-text>
                    {{ topic.description }}
                  </v-card-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { getBook } from '@/services/apiBooks.ts'
import { getTopicsByBookId } from '@/services/apiTopics.ts'

// Import correto do seu componente
import bookTopicsDialog from '@/components/bookTopicsDialog.vue'

const books = ref([])
const showDialog = ref(false)
const selectedBook = ref(null)
const topics = ref([])

onMounted(async () => {
  books.value = await getBook()
})

async function openExplore(book) {
  selectedBook.value = book
  try {
    topics.value = await getTopicsByBookId(book.id)
  } catch {
    topics.value = []
  }
  showDialog.value = true
}
</script>
<style scoped>
.v-card {
  border-radius: 16px;
  overflow: hidden;
  width: 50vh;
  margin-top: 60px;
}
</style>
