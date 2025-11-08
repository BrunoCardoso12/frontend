<template>
  <v-container class="mt-2">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="8" class="pa-8" title="User Registration">
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="first"
                  color="primary"
                  label="First name"
                  variant="underlined"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="last"
                  color="primary"
                  label="Last name"
                  variant="underlined"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="email"
                  color="primary"
                  label="Email"
                  type="email"
                  variant="underlined"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="password"
                  color="primary"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  variant="underlined"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-checkbox
                  class="customCheckbox"
                  v-model="terms"
                  color="red"
                  label="I agree to site terms and conditions"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-container>

          <v-divider class="my-4"></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="btnComplete"
              color="black"
              @click="save"
              :disabled="!terms || !first || !last || !email || !password"
            >
              Complete Registration
              <v-icon icon="mdi-chevron-right" end></v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUsers, addUser } from '@/services/apiService.ts'

const first = ref('')
const last = ref('')
const email = ref('')
const password = ref('')
const terms = ref(false)

const users = ref([])

onMounted(async () => {
  users.value = await getUsers()
  if (users.value === `${first.value} ${last.value}`) {
    alert('Esse usuario ja existe')
  }
})

async function save() {
  const newUser = {
    username: `${first.value} ${last.value}`,
    email: email.value,
    password: password.value,
  }

  await addUser(newUser)
  users.value = await getUsers()

  first.value = ''
  last.value = ''
  email.value = ''
  password.value = ''
  terms.value = false
}
</script>
<style scoped>
.btnComplete {
  background-color: rgb(111, 215, 247);
}
</style>
