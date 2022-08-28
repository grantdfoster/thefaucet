<template>
  <div class="PageContainer"></div>
</template>

<script setup>
import { onMounted, computed, useStore } from '@nuxtjs/composition-api'

const store = useStore()

const provider = computed(() => {
  return store.getters['metamask/provider']
})

onMounted(async () => {
  const addresses = await provider.value.listAccounts()
  if (addresses.length) store.dispatch('metamask/connectWallet')
})
</script>
<style lang="scss" scoped></style>
