<template>
  <v-container class="mt-2">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="8" class="pa-8" title="User Registration">
          <v-container>
            <Avatar/>
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
            <v-btn color="error" variant="text" @click="$emit('close')"> Fechar </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              class="bg-success"
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
<script setup>
import { ref } from 'vue'

import { createUser } from '@/services/apiRegisterUsers'

import Avatar from '@/components/avatar.vue'

const emit = defineEmits(['close'])

const first = ref('')
const last = ref('')
const email = ref('')
const password = ref('')
const terms = ref(false)
const photo = ref(null)

const message = ref('')
const alertType = ref('success')

async function save() {
  try {
    const user = {
      username: `${first.value} ${last.value}`,
      email: email.value,
      password: password.value,
    }

    const response = await createUser(user)
    message.value = `Usuário criado com sucesso! ID: ${response.id}`
    alertType.value = 'success'
    emit('close')

    // limpa o formulário
    first.value = ''
    last.value = ''
    email.value = ''
    password.value = ''
    terms.value = false
  } catch (error) {
    console.error(error)
    message.value = error.response?.data?.message || 'Erro ao criar usuário.'
    alertType.value = 'error'
  }
}
</script>
