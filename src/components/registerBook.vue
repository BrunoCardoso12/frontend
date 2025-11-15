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
          <!-- Alert -->
          <v-alert v-if="message" :type="alertType" class="mb-4">
            {{ message }}
          </v-alert>

          <!-- Busca Google Books -->
          <v-text-field
            v-model="query"
            label="Search Google Books"
            variant="underlined"
            @keyup.enter="handleSearch"
            clearable
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
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="author"
                  label="Author*"
                  variant="underlined"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field v-model="isbn" label="ISBN" variant="underlined"></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="year"
                  label="Year"
                  type="number"
                  variant="underlined"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="category"
                  label="Category"
                  variant="underlined"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="description"
                  label="Description"
                  variant="underlined"
                  rows="3"
                  auto-grow
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>

          <v-divider class="my-4"></v-divider>

          <v-card-actions>
            <v-btn color="grey" variant="text" @click="$emit('close')">Fechar</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="saveBook" :disabled="!title || !author">
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

const emit = defineEmits(['close'])
const message = ref('')
const alertType = ref('success')

const query = ref('')
const searchResults = ref<any[]>([])

const title = ref('')
const author = ref('')
const isbn = ref('')
const year = ref<number | null>(null)
const category = ref('')
const description = ref('')

// Busca Google Books
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

// Seleciona livro e preenche formulário
function selectBook(book: any) {
  title.value = book.title
  author.value = book.author
  year.value = book.year
  category.value = book.category
  isbn.value = book.isbn
  searchResults.value = []
  query.value = ''
  description.vlaue = book.description
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
  }
}

// Salva livro na sua API local
async function saveBook() {
  if (!title.value || !author.value) {
    message.value = 'Please fill all required fields'
    alertType.value = 'error'
    return
  }

  try {
    // Busca a imagem no Google Books
    const imageUrl = await fetchBookImage(title.value)

    const book = {
      title: title.value,
      author: author.value,
      isbn: isbn.value,
      year: year.value,
      category: category.value,
      description: description.value,
      coverImageUrl: imageUrl,
    }

    // Salva no backend
    const { data } = await axios.post('http://localhost:8080/api/books', book)
    message.value = `Book registered! ID: ${data.id}`
    alertType.value = 'success'

    // Limpa campos
    title.value = ''
    author.value = ''
    isbn.value = ''
    year.value = null
    category.value = ''
    description: ''
  } catch (error) {
    console.error(error)
    message.value = 'Error registering book'
    alertType.value = 'error'
  }
}
</script>

<style scoped>
.v-list-item {
  cursor: pointer;
}
</style>
