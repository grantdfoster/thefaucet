<template>
  <div class="modal">
    <DashboardTemplate>
      <div class="modal__panel">
        <div class="modal__panel--close" @click="emit('close')">
          <span class="material-icons-outlined"> close </span>
        </div>
        <div v-if="!showEmail" class="modal__panel--web3">
          <h3 class="titletext">Connect</h3>
          <ButtonOutlinedBefore text="Metamask" @click.native="connect">
            <img class="icons" src="~/assets/icons/metamask.png" />
          </ButtonOutlinedBefore>
          <ButtonOutlinedBefore text="WalletConnect" @click.native="stub">
            <img class="icons" src="~/assets/icons/walletconnect.png" />
          </ButtonOutlinedBefore>
          <ButtonOutlinedBefore text="Coinbase" @click.native="stub">
            <img class="icons" src="~/assets/icons/coinbase.png" />
          </ButtonOutlinedBefore>
          <a class="toggle" @click="showEmail = true">Login with Email</a>
        </div>
        <div v-else class="modal__panel--email">
          <h3 class="titletext">Login</h3>
          <div>
            <p class="description">Email</p>
            <input v-model="email" type="text" class="input" placeholder="Email" />
          </div>
          <div>
            <p class="description">Password</p>
            <input v-model="password" type="password" class="input" placeholder="Password" />
          </div>
          <ButtonPrimary text="Log In" @click.native="logInEmail" />
          <a class="toggle" @click="showEmail = false">Login with Web3</a>
        </div>
      </div>
    </DashboardTemplate>
  </div>
</template>

<script setup>
import { useContext, useStore, ref } from '@nuxtjs/composition-api'
const { $toast } = useContext()
const store = useStore()

// refs
const showEmail = ref(false)
const email = ref('')
const password = ref('')

const emit = defineEmits(['close'])

const stub = () => {
  $toast.info('Coming Soon!').goAway(3000)
}

// connect with web3!
const connect = async () => {
  try {
    await store.dispatch('metamask/connectWallet')
    emit('close')
  } catch (e) {
    console.error(e)
    $toast.error(e).goAway(5000)
  }
}

// connect with email!
const logInEmail = () => {
  if (!email.value || !password.value) {
    return $toast.error('Please provide credentials!').goAway(3000)
  }
  const body = {
    email: email.value,
    password: password.value,
  }
  console.log('logging in with email...', body)
  $toast.info('Coming Soon!').goAway(3000)
}
</script>

<style lang="scss" scoped>
.modal {
  user-select: none;
  color: white;
  @extend .figma-glass;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 101;
  &__panel {
    @extend .figma-glass;
    position: relative;
    border: 0.0625rem solid rgba(255, 255, 255, 0.4);
    border-radius: 0.5rem;
    display: flex;
    width: 20rem;
    flex-direction: column;
    align-items: left;
    justify-content: center;
    padding: 2rem;
    background-color: rgba(0, 0, 0, 0.477);
    z-index: 102;

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
    &--email {
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

// could take this to main~!
$borderColor: rgb(122, 122, 122);
$backgroundColor: rgba(black, 0.65);

.input {
  padding: 0.75rem 1rem 0.75rem 1rem;
  background: $backgroundColor;
  border: 0.0625rem solid $borderColor;
  color: white;
  border-radius: 0.75rem;
  transition: all 0.3s ease-in-out;
  width: 100%;
  margin-top: 0.5rem;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: $borderColor;
    font-size: 0.9rem;
  }
  &::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
    height: 0.625rem;
    width: 0.625rem;
    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjEyMy4wNXB4IiBoZWlnaHQ9IjEyMy4wNXB4IiB2aWV3Qm94PSIwIDAgMTIzLjA1IDEyMy4wNSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTIzLjA1IDEyMy4wNTsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTEyMS4zMjUsMTAuOTI1bC04LjUtOC4zOTljLTIuMy0yLjMtNi4xLTIuMy04LjUsMGwtNDIuNCw0Mi4zOTlMMTguNzI2LDEuNzI2Yy0yLjMwMS0yLjMwMS02LjEwMS0yLjMwMS04LjUsMGwtOC41LDguNQ0KCQljLTIuMzAxLDIuMy0yLjMwMSw2LjEsMCw4LjVsNDMuMSw0My4xbC00Mi4zLDQyLjVjLTIuMywyLjMtMi4zLDYuMSwwLDguNWw4LjUsOC41YzIuMywyLjMsNi4xLDIuMyw4LjUsMGw0Mi4zOTktNDIuNGw0Mi40LDQyLjQNCgkJYzIuMywyLjMsNi4xLDIuMyw4LjUsMGw4LjUtOC41YzIuMy0yLjMsMi4zLTYuMSwwLTguNWwtNDIuNS00Mi40bDQyLjQtNDIuMzk5QzEyMy42MjUsMTcuMTI1LDEyMy42MjUsMTMuMzI1LDEyMS4zMjUsMTAuOTI1eiIvPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=);
    background-size: 0.625rem 0.625rem;
    filter: brightness(0) invert(1);
    opacity: 0.35;
  }
}

.toggle {
  cursor: pointer;
  // text-decoration: underline;
  font-weight: 300;
  text-align: right;
  color: #d4d4d4;
}

.titletext {
  font-weight: 500;
  font-family: $secondary-font;
  line-height: 2.0625rem;
  font-size: 1.6rem;
}
.description {
  color: #d4d4d4;
}
</style>
