<template>
  <div class="modal">
    <div class="modal__panel">
      <transition name="fade">
        <DashboardClose class="modal__panel--close" @click.native="$emit('close')" />
      </transition>
      <div class="modal__panel--web3">
        <h3 class="titletext">Connect</h3>
        <ButtonPrimary text="Metamask" @click.native="connect">
          <img class="icons" src="~/assets/icons/metamask.png" />
        </ButtonPrimary>
        <ButtonPrimary text="WalletConnect" @click.native="stub">
          <img class="icons" src="~/assets/icons/walletconnect.png" />
        </ButtonPrimary>
        <ButtonPrimary text="Coinbase" @click.native="stub">
          <img class="icons" src="~/assets/icons/coinbase.png" />
        </ButtonPrimary>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useContext, useStore } from '@nuxtjs/composition-api'
const { $toast } = useContext()
const store = useStore()

const emit = defineEmits(['close'])

const stub = () => {
  $toast.info('Coming Soon!').goAway(3000)
}

// connect with web3!
const connect = async () => {
  try {
    await store.dispatch('metamask/connectMetamask')
    emit('close')
  } catch (e) {
    console.error(e)
    $toast.error(e).goAway(5000)
  }
}
</script>

<style lang="scss" scoped>
.modal {
  user-select: none;
  color: $gray-default;
  @extend .white-glass;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  &__panel {
    background: white;
    box-shadow: $box-shadow-default;
    position: relative;
    border-radius: 1rem;
    display: flex;
    width: 20rem;
    flex-direction: column;
    align-items: left;
    justify-content: center;
    padding: 2rem;
    &--close {
      cursor: pointer;
      position: absolute;
      top: 1rem;
      right: 1rem;
    }
    &--web3 {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      position: relative;
    }
  }
}
.icons {
  height: 2rem;
}
.titletext {
  font-weight: 500;
  line-height: 2.0625rem;
  font-size: 1.8rem;
  font-family: $title-font;
  text-align: center;
}
</style>
