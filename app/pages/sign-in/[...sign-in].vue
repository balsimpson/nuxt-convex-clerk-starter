<template>
  <div class="min-h-screen grid place-items-center">
    <SignIn
      force-redirect-url="/admin"
      fallback-redirect-url="/admin"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const { isLoaded, isSignedIn } = useAuth()

watchEffect(() => {
  if (isLoaded.value && isSignedIn.value) {
    navigateTo('/admin')
  }
})
</script>
