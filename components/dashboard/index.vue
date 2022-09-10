<template>
  <div class="DashboardComponent">
    <transition-group name="fade">
      <div v-if="showDashboard" key="gradient" class="gradient"></div>
      <div v-show="showDashboard" key="carousel" class="carousel">
        <VueSlickCarousel ref="carousel" v-bind="slickSettings" @afterChange="afterChange" @beforeChange="beforeChange">
          <DashboardMenu :active="currentSlide === 0" :changing="changing" @close="closeDash" />
          <DashboardAbout :active="currentSlide === 1" :changing="changing" @close="closeDash" />
          <DashboardSettings :active="currentSlide === 2" :changing="changing" @close="closeDash" />
        </VueSlickCarousel>
      </div>
    </transition-group>
    <div :class="`Toolbar ${showDashboard ? 'Toolbar__active' : null}`">
      <div v-show="showDashboard" class="Toolbar__inner">
        <div
          :class="`cell ${currentSlide === 0 ? 'cell__current' : null}`"
          @click="() => goTo(0)"
          @mouseover="() => iconHovered('menu')"
          @mouseout="iconUnhovered"
        >
          <span v-if="currentSlide === 0" class="cell__icon selected material-icons-outlined"> menu </span>
          <span v-else-if="hovered === 'menu'" class="cell__icon hovered material-icons-outlined"> menu </span>
          <span v-else class="cell__icon material-icons-outlined"> menu </span>
        </div>
        <div
          :class="`cell ${currentSlide === 1 ? 'cell__current' : null}`"
          @click="() => goTo(1)"
          @mouseover="() => iconHovered('settings')"
          @mouseout="iconUnhovered"
        >
          <span v-if="currentSlide === 1" class="cell__icon selected material-icons-outlined"> info </span>
          <span v-else-if="hovered === 'settings'" class="cell__icon hovered material-icons-outlined"> info </span>
          <span v-else class="cell__icon material-icons-outlined"> info </span>
        </div>
        <div
          :class="`cell ${currentSlide === 2 ? 'cell__current' : null}`"
          @click="() => goTo(2)"
          @mouseover="() => iconHovered('about')"
          @mouseout="iconUnhovered"
        >
          <span v-if="currentSlide === 2" class="cell__icon selected material-icons-outlined"> settings </span>
          <span v-else-if="hovered === 'about'" class="cell__icon hovered material-icons-outlined"> settings </span>
          <span v-else class="cell__icon material-icons-outlined"> settings </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed, useStore } from '@nuxtjs/composition-api'

const emit = defineEmits(['toggled'])

const props = defineProps({
  assets: {
    type: Boolean,
    default: false,
  },
})

const store = useStore()

const changing = ref(false)

const showManage = ref(false)

const carousel = ref(null)

const showDashboard = computed(() => {
  return store.getters['dashboard/isOpen']
})

const currentSlide = ref(0)
const hovered = ref(null)

const iconHovered = (icon) => {
  hovered.value = icon
}
const iconUnhovered = () => {
  hovered.value = null
}

const beforeChange = (_before, _after) => {
  changing.value = true
  currentSlide.value = _after
}

const afterChange = () => {
  setTimeout(() => {
    changing.value = false
  }, 250)
}

const closeDash = () => {
  slickSettings.initialSlide = currentSlide.value
  currentSlide.value = null
  showManage.value = true
  store.dispatch('dashboard/setOpen', false)
  emit('toggled', showDashboard.value)
}

onMounted(() => {
  // document.addEventListener('keydown', keyListener)
})

const goTo = (_index) => {
  try {
    if (currentSlide.value === _index) {
      closeDash()
    } else {
      carousel.value.goTo(_index)
    }
  } catch (e) {
    console.log('carousel go to error: ', e)
  }
}

const slickSettings = reactive({
  dots: false,
  arrows: false,
  infinite: false,
  swipeToSlide: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  initialSlide: 0,
  centerMode: true,
  centerPadding: '0%',
  autoplay: false,
  speed: 650,
})
</script>

<style lang="scss" scoped>
.DashboardComponent {
  user-select: none;
}
.carousel {
  width: 100%;
  position: absolute;
  top: 50vh;
  transform: translateY(-50%);
  outline: none;
}

.Toolbar {
  position: fixed;
  left: 50vw;
  transform: translateX(-50%);
  padding: 0.5rem 0.75rem;
  color: rgb(115, 115, 115);
  border-radius: 0.75rem;
  bottom: -2rem;
  transition: 0.5s bottom ease-in-out;
  z-index: 100;
  box-shadow: $box-shadow-default;
  @extend .white-glass;
  &__basic {
    height: 2.75rem;
    padding: 0.5rem 3rem 1rem 3rem;
    display: flex;
    justify-content: center;
    cursor: pointer;
    transition: 0.3s all ease-in-out;
    &:hover {
      transform: scale($zoom-default);
    }
  }
  &__inner {
    display: flex;
    align-items: center;
    gap: 1rem;
    // transform: translateY(-2.1rem);
    width: 100%;
  }
  &__active {
    bottom: 2rem;
    padding: 0.5rem 0.75rem;
  }
  &__light {
    background: rgba(255, 255, 255, 0.1);
  }
}

.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
  height: 100%;
  &__icon {
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    font-size: 2rem;
    color: rgba(0, 0, 0, 0.35);
    &.selected {
      font-size: 2.5rem;
      color: rgb(0, 0, 0);
    }
    &.hovered {
      font-size: 2.25rem;
      color: rgb(0, 0, 0);
    }
  }
}

.messaging {
  color: $gray-default;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
}

::v-deep .slick-slide {
  display: flex !important; // need important here!
  min-height: 100vh;
  align-items: center !important;
  justify-content: center !important;
  position: relative !important;
  z-index: 2 !important;
}

.gradient {
  @extend .gradient;
}
.nudge-down {
  transform: translateY(0.15rem);
}
</style>
