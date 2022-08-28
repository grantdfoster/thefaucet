<template>
  <button class="secondaryButton">
    <p class="secondaryButton__text">{{ props.text }}</p>
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
.secondaryButton {
  cursor: pointer;
  border-radius: 0.5rem;
  padding: 0.5rem 1.25rem;
  font-weight: 500;
  color: $gray-default;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background-size: 200% auto;
  box-shadow: 0 0 1.25rem #eee;
  box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.12), 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background-image: linear-gradient(to right, #ffffff 0%, #57a2be 100%);
  &:hover {
    background-position: right center;
  }
  &__text {
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */
  }
}
</style>
