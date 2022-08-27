<template>
  <button class="primaryButton">
    <slot></slot>
    <p class="primaryButton__text">{{ props.text }}</p>
  </button>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: '',
  },
})
</script>
<style lang="scss" scoped>
.primaryButton {
  cursor: pointer;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  font-weight: 500;
  color: black;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  background-size: 200% auto;
  box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.12), 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  height: 2.875rem;
  background: linear-gradient(142.61deg, #ffffff 3.84%, #d8d8d8 95.81%);
  transition: 0.3s all ease-in-out;
  &:hover {
    transform: scale(1.03);
  }
  &:active {
    transform: scale(1);
  }
  &__text {
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */
  }
}
</style>
