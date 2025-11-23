<template>
  <form @submit.prevent="submit">
    <v-text-field
      v-model="name.value.value"
      :counter="10"
      :error-messages="name.errorMessage.value"
      label="Name"
    ></v-text-field>

    <v-text-field
      v-model="last_name.value.value"
      :counter="7"
      :error-messages="last_name.errorMessage.value"
      label="Last Name"
    ></v-text-field>

    <v-text-field
      v-model="email.value.value"
      :error-messages="email.errorMessage.value"
      label="E-mail"
    ></v-text-field>

    <v-select
      v-model="select.value.value"
      :error-messages="select.errorMessage.value"
      :items="items"
      label="Select"
    ></v-select>

    <v-text-field
      v-model="password.value.value"
      :error-messages="password.errorMessage.value"
      label="Password"
    ></v-text-field>

    <v-btn class="me-4" type="submit" @click="submit"> submit </v-btn>

    <v-btn @click="handleReset"> clear </v-btn>
  </form>
</template>
<script setup>
import { ref } from 'vue'
import { useField, useForm } from 'vee-validate'

import Avatar from '@/components/avatar.vue'

import { updateUser } from '@/services/apiRegisterUsers.ts'

const { handleSubmit, handleReset } = useForm({
  validationSchema: {
    name(value) {
      if (value?.length >= 2) return true

      return 'Name needs to be at least 2 characters.'
    },
    last_name(value) {
      if (value?.length >= 2) return true

      return 'Last name needs to be at least 2 characters.'
    },
    email(value) {
      if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true

      return 'Must be a valid e-mail.'
    },
    select(value) {
      if (value) return true

      return 'Select an item.'
    },
    password(value) {
      if (value?.length >= 6) return true

      return 'Password must be at least 6 characters.'
    },
  },
})
const name = useField('name')
const lastName = useField('last_name')
const email = useField('email')
const select = useField('select')
const password = useField('password')

const submit = handleSubmit((values) => {
  
})

</script>
