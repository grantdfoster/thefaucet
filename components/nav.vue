<template>
  <div class="Navigation">
    <div class="Navigation__inner">
      <div class="Navigation__inner--cell Navigation__inner--cell-left">
        <div class="row">
          <!-- <img class="Navigation__inner--logo" :src="logo" alt="logo" @click="$router.push('/')" /> -->
          <p>The Faucet</p>
        </div>
      </div>
      <transition name="fade">
        <div class="Navigation__inner--cell Navigation__inner--cell-right">
          <ButtonPrimary v-if="!correctNetwork" text="Change Network" @click.native="changeNetwork">
            <span class="material-icons-outlined"> error_outline </span>
          </ButtonPrimary>
          <ButtonPrimary
            v-if="correctNetwork && !accounts"
            text="Connect"
            @click.native="() => (showAuthenticator = true)"
          />
          <ButtonPrimary
            v-if="correctNetwork && accounts"
            :text="`${accounts[0].substring(0, 12)}...`"
            :class="`${routeName !== 'world' && routeName !== 'index' ? 'greyed' : ''}`"
            @click.native="disconnect"
          >
            <span class="material-icons-outlined close"> close </span>
          </ButtonPrimary>
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
    accounts() {
      return this.$store.getters['metamask/accounts']
    },
    correctNetwork() {
      return this.$store.getters['metamask/correctNetwork']
    },
    routeName() {
      const name = this.$route.name
      return name
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
  &__inner {
    @extend .max-width-wrapper;
    width: 100%;
    height: 6.75rem;
    // padding: 3.75rem 5rem 0rem 5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &--cell {
      display: flex;
      align-items: center;
      &-left {
        justify-content: flex-start;
      }
      &-center {
        justify-content: center;
      }
      &-right {
        justify-content: flex-end;
      }
    }
    &--logo {
      height: 2.5rem;
      cursor: pointer;
      margin-left: 0.25rem;
      position: relative;
      z-index: 200;
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
  z-index: 1000;
}
.close {
  font-size: 1rem;
}
.row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
