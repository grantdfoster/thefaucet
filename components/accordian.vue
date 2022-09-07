<template>
  <div :class="[isOpen ? 'accordion open' : 'accordion']">
    <div class="accordion__title" @click="isOpen = !isOpen">
      {{ props.title }}
    </div>
    <div v-if="isOpen" class="accoridan__body">
      <slot class="slot-text"></slot>
    </div>
  </div>
</template>

<script setup>
import { useContext, ref } from '@nuxtjs/composition-api'
const isOpen = ref(false)

const props = defineProps({
  title: {
    type: String,
    required: true,
    default: 'Title',
  },
})
</script>

<style lang="scss" scoped>
.accordion {
  border-bottom: 0.0625rem solid #3f3f3f;
  padding: 0;
  color: #000;
  overflow: hidden;
  color: white;
  &__title {
    font-weight: 400;
    font-size: 1rem;
    line-height: 2rem;
    padding: 1rem 0rem;
    color: white;
    position: relative;
    cursor: pointer;
    &:after {
      content: '';
      position: absolute;
      top: 50%;
      right: 1.3125rem;
      transform: translateY(-50%) rotate(90deg);
      background-image: url('~/assets/icons/back.png');
      background-repeat: no-repeat;
      background-size: contain;
      width: 0.5625rem;
      height: 0.9375rem;
      transition: transform 0.25s ease-in-out;
    }
  }
  &__body {
    font-weight: 400;
    font-size: 0.9rem;
    padding: 0 1rem;
    overflow-y: hidden;
    opacity: 0;
    transition: all 0.25s ease-in-out;
  }
  &.open {
    padding-bottom: 1rem;
    .accordion__title {
      &:after {
        transform: translateY(-50%) rotate(270deg);
      }
    }
    .accordion__body {
      opacity: 1;
      max-height: 62.5rem;
    }
  }
}
</style>
