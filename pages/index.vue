<template>
  <div class="PageContainer">
    <p>Drip Balance: {{ dripBalance }}</p>
  </div>
</template>

<script setup>
import { onMounted, computed, useStore } from '@nuxtjs/composition-api'
import { ethers } from 'ethers'

const store = useStore()

onMounted(() => {
  const hex = ethers.utils.hexlify(56)
  // const stripped = ethers.utils.stripZeros(ethers.utils.hexlify(56))
  console.log('hex: ', hex)
})

const dripBalance = computed(() => {
  return store.getters['metamask/dripBalance']
})
</script>
<style lang="scss" scoped></style>
