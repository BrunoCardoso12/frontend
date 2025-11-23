<template>
  <v-container class="mt-2">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card
          elevation="8"
          class="pa-8 pb-4"
          title="Register Book"
          max-width="600"
          style="max-height: 80vh; overflow-y: auto"
        >
          <v-alert v-if="message" :type="alertType" class="mb-4">
            {{ message }}
          </v-alert>

          <v-overlay :model-value="loading" absolute>
            <v-progress-circular indeterminate size="64"></v-progress-circular>
          </v-overlay>

          <v-text-field
            v-model="query"
            label="Search Google Books"
            variant="underlined"
            @keyup.enter="handleSearch"
            clearable
            :disabled="loading"
          ></v-text-field>

          <v-list v-if="searchResults.length" class="mb-4">
            <v-list-item
              v-for="book in searchResults"
              :key="book.isbn || book.title"
              @click="selectBook(book)"
            >
              <v-list-item-title>{{ book.title }} - {{ book.author }}</v-list-item-title>
            </v-list-item>
          </v-list>

          <!-- Formulário -->
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="title"
                  label="Title*"
                  variant="underlined"
                  required
                  :disabled="loading"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="author"
                  label="Author*"
                  variant="underlined"
                  required
                  :disabled="loading"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field v-model="isbn" label="ISBN" variant="underlined" :disabled="loading"></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="year"
                  label="Year"
                  type="number"
                  variant="underlined"
                  :disabled="loading"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="category"
                  label="Category"
                  variant="underlined"
                  :disabled="loading"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="description"
                  label="Description"
                  variant="underlined"
                  rows="3"
                  auto-grow
                  :disabled="loading"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>

          <v-divider class="my-4"></v-divider>

          <v-card-actions>
            <v-btn color="error" variant="text" @click="$emit('close')" :disabled="loading">Fechar</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="saveBook" :disabled="!title || !author || loading" :loading="loading">
              Register Book
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

import { getLoggedUser } from '@/composable/auth.ts'

import { getMyBooks } from '@/services/apiBooks.ts'

const emit = defineEmits(['close'])
const message = ref('')
const alertType = ref('success')
const loading = ref(false)

const query = ref('')
const searchResults = ref<any[]>([])

const title = ref('')
const author = ref('')
const isbn = ref('')
const year = ref<number | null>(null)
const category = ref('')
const description = ref('')

async function handleSearch() {
  if (!query.value) return
  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query.value)}`,
    )

    searchResults.value =
      data.items?.map((item: any) => {
        const volume = item.volumeInfo
        return {
          title: volume.title || '',
          author: volume.authors?.join(', ') || '',
          year: volume.publishedDate?.split('-')[0] || '',
          category: volume.categories?.join(', ') || '',
          isbn: volume.industryIdentifiers?.[0]?.identifier || '',
        }
      }) || []
  } catch (error) {
    console.error('Erro ao buscar no Google Books:', error)
    message.value = 'Error searching Google Books'
    alertType.value = 'error'
  }
}

function selectBook(book: any) {
  title.value = book.title
  author.value = book.author
  year.value = book.year
  category.value = book.category
  isbn.value = book.isbn
  searchResults.value = []
  query.value = ''
  description.value = book.description
}

async function fetchBookImage(title: string) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}`,
    )
    const items = response.data.items
    if (items && items.length > 0) {
      const volumeInfo = items[0].volumeInfo
      return volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') || ''
    }
    return ''
  } catch (error) {
    console.error('Erro ao buscar imagem:', error)
    return ''
  } finally {
    setTimeout(() => {
      location.reload()
    }, 1500)
  }
}

function reloadBooks() {
  getMyBooks().then((data) => (books.value = data))
}

// Salva livro na sua API local
async function saveBook() {
  if (!title.value || !author.value) {
    message.value = 'Please fill all required fields'
    alertType.value = 'error'
    return
  }
  loading.value = true
  try {
    const imageUrl = await fetchBookImage(title.value)

    const user = getLoggedUser()
    if (!user || !user.id) {
      message.value = 'Usuário não logado.'
      alertType.value = 'error'
      return
    }

    const book = {
      title: title.value,
      author: author.value,
      isbn: isbn.value,
      year: year.value,
      category: category.value,
      description: description.value,
      coverImageUrl: imageUrl,
      owner: { id: user.id },
    }

    // Salva no backend
    const { data } = await axios.post('http://localhost:8080/api/books', book)
    message.value = `Book registered! ID: ${data.id}`
    alertType.value = 'success'

    emit('book-registered', data)

    // Limpa campos
    title.value = ''
    author.value = ''
    isbn.value = ''
    year.value = null
    category.value = ''
    description.value = ''
  } catch (error) {
    console.error(error)
    message.value = 'Error registering book'
    alertType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.v-list-item {
  cursor: pointer;
}
</style>
