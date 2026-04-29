<!-- pages/sign-in.vue -->
<template>
  <div class="min-h-screen grid place-items-center">
    <SignIn />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})
const { isLoaded, isSignedIn } = useAuth()

watchEffect(() => {
  if (isLoaded.value && isSignedIn.value) {
    navigateTo('/')
  }
})
</script>