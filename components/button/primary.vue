<template>
  <button class="primaryButton">
    <p class="primaryButton__text">{{ props.text }}</p>
    <slot></slot>
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
  border-radius: 0.5rem;
  padding: 0.5rem 1.25rem;
  font-weight: 500;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background-size: 200% auto;
  box-shadow: 0 0 1.25rem #eee;
  box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.12), 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  min-width: 7.125rem;
  height: 2.875rem;
  background: linear-gradient(142.61deg, #f8971d 3.84%, #ef4623 95.81%);
  transition: 0.3s all ease-in-out;
  &:hover {
    background: linear-gradient(142.61deg, #f8971d 15.84%, #ef4623 75.81%);
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
