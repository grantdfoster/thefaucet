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
  color: $gray-default;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 3rem;
  box-shadow: $box-shadow-shallow;
  transition: all 0.3s cubic-bezier(0.2, 0.5, 0.2, 0.5);
  background: linear-gradient(90deg, #ffffff 0%, #eeeeee 100%);
  @media #{$md-medium} {
    &:hover {
      transform: scale($zoom-default);
    }
  }
}
</style>
