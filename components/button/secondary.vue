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
  border-radius: 1rem;
  padding: 0.75rem 1.25rem;
  font-weight: 500;
  color: $gray-default;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: $box-shadow-default;
  transition: all 0.3s cubic-bezier(0.2, 0.5, 0.2, 0.5);
  background: linear-gradient(120deg, #ffffff 0%, #83c5ff 100%);
  &:hover {
    transform: scale($zoom-default);
  }
}
</style>
