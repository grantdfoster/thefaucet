<template>
  <div id="about-panel">
    <DashboardTemplate class="about">
      <transition name="fade">
        <DashboardClose v-show="!props.changing && props.active" @click.native="$emit('close')" />
      </transition>
      <div class="inner">
        <div>
          <h3 class="title">About</h3>
          <!-- <br /> -->
          <hr class="divider" />
          <p class="description">
            The Faucet is a high-yield web3 contract that operates similar to a certificate of deposit in traditional
            banking.Leveraging the power of compound interest, achieve financial freedom through passive daily cashflow.
          </p>
        </div>
      </div>
    </DashboardTemplate>
  </div>
</template>

<script setup>
import { useContext, onMounted, onBeforeUnmount, ref } from '@nuxtjs/composition-api'

const intervalId = ref(null)

const { $toast } = useContext()

const stub = () => {
  $toast.info('Coming Soon!').goAway(3000)
}

const scale = (number, inMin, inMax, outMin, outMax) => {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

const eventListener = () => {
  const _panel = document.getElementById('about-panel')
  const _centerOfPanelX = _panel.getBoundingClientRect().left + _panel.getBoundingClientRect().width / 2
  const _centerOfWindow = window.innerWidth / 2

  const _difference = Math.abs(_centerOfPanelX - _centerOfWindow)
  const _scaleFactor = scale(_difference, 0, _centerOfWindow, 1, 0.8)
  // const _opacityFactor = scale(_difference, 0, _centerOfWindow, 1, 0.7)

  _panel.style.transform = `scale(${_scaleFactor})`
  // _panel.style.opacity = _opacityFactor
}

onMounted(() => {
  intervalId.value = window.setInterval(eventListener, 20)
})

onBeforeUnmount(() => {
  window.clearInterval(intervalId.value)
})

const props = defineProps({
  changing: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
})
</script>
<style lang="scss" scoped>
.about {
  outline: none;
}
.inner {
  border-radius: 1rem;
  padding: 2rem 2rem 4rem;
}
.title {
  font-size: 1.75rem;
  font-weight: 500;
  position: relative;
  z-index: 2;
  text-align: center;
  font-family: $title-font;
  color: black;
}
.description {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
  position: relative;
  z-index: 2;
  // text-align: center;
  color: black;
}
.logo {
  height: 12.25rem;
  transform: translate(0.75rem, 2.5rem);
  position: relative;
  z-index: 2;
  user-drag: none;
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.col-2 {
  align-items: flex-end;
  display: flex;
  flex-direction: row-reverse;
}
.divider {
  height: 1px;
  width: 50%;
  transform: translateX(-50%);
  margin: 0.75rem 50%;
}
</style>
