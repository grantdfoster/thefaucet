<template>
  <div class="Navigation">
    <div class="Navigation__inner">
      <div class="Navigation__inner--cell">
        <ButtonLogo>
          <span class="material-icons-outlined close"> menu </span>
        </ButtonLogo>
      </div>
      <div class="Navigation__inner--cell">
        <p class="title">The Faucet</p>
      </div>
      <transition name="fade">
        <div v-if="!isMobile" class="Navigation__inner--cell">
          <ButtonPrimary v-if="!correctNetwork" text="Network" @click.native="changeNetwork">
            <span class="material-icons-outlined"> error_outline </span>
          </ButtonPrimary>
          <ButtonPrimary
            v-if="correctNetwork && !walletAddress"
            text="Connect"
            @click.native="() => (showAuthenticator = true)"
          />
          <ButtonPrimary
            v-if="correctNetwork && walletAddress"
            :text="`${walletAddress.substring(0, 12)}...`"
            @click.native="disconnect"
          >
            <span class="material-icons-outlined close"> close </span>
          </ButtonPrimary>
        </div>
        <div v-if="isMobile" class="Navigation__inner--cell">
          <ButtonLogo v-if="!correctNetwork" @click.native="changeNetwork">
            <span class="material-icons-outlined"> error_outline </span>
          </ButtonLogo>
          <ButtonLogo v-if="correctNetwork && !walletAddress" @click.native="() => (showAuthenticator = true)">
            <span class="material-icons-outlined"> login </span>
          </ButtonLogo>
          <ButtonLogo v-if="correctNetwork && walletAddress" @click.native="disconnect">
            <span class="material-icons-outlined close"> wallet </span>
          </ButtonLogo>
        </div>
      </transition>
    </div>
    <!-- LOGIN MODAL -->
    <transition name="fade">
      <Authenticate v-if="showAuthenticator" id="authenticate" @close="() => (showAuthenticator = false)" />
    </transition>
  </div>
</template>
<script>
import Vue from 'vue'
import logo from '@/assets/icons/logo.png'

export default Vue.extend({
  name: 'NavBar',
  data() {
    return {
      logo,
      showAuthenticator: false,
    }
  },

  computed: {
    walletAddress() {
      return this.$store.getters['metamask/walletAddress']
    },
    correctNetwork() {
      return this.$store.getters['metamask/correctNetwork']
    },
    routeName() {
      const name = this.$route.name
      return name
    },
    isMobile() {
      return this.$store.getters['window/isMobile']
    },
  },
  methods: {
    async changeNetwork() {
      await this.$store.dispatch('metamask/changeNetwork')
    },
    disconnect() {
      this.$store.dispatch('metamask/disconnect')
    },
  },
})
</script>
<style lang="scss" scoped>
.Navigation {
  width: 100%;
  user-select: none;
  color: black;
  background: none;
  position: relative;
  z-index: 1;
  &__inner {
    @extend .max-width-wrapper;
    width: 100%;
    height: 6rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &--cell {
      display: flex;
      align-items: center;
    }
    &--logo {
      height: 2.5rem;
      cursor: pointer;
      margin-left: 0.25rem;
      position: relative;
      z-index: 2;
    }
  }
}
.greyed {
  background: rgba(0, 0, 0, 0.4) !important;
  border: 0.0625rem solid rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(2rem) !important;
  &:hover {
    background: rgba(0, 0, 0, 0.2) !important;
  }
}
#authenticate {
  position: fixed;
}
.close {
  font-size: 1rem;
}
.row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.title {
  font-family: $title-font;
  font-size: 2rem;
}
.auth-button {
  display: none;
  @media #{$md-medium} {
    display: initial;
  }
}
</style>
