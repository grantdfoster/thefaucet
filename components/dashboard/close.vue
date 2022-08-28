<template>
  <div class="Close">
    <span class="material-icons-outlined"> close </span>
  </div>
</template>
<script setup>
const props = defineProps({
  dark: {
    type: Boolean,
    default: true,
  },
})
</script>

<style lang="scss" scoped>
.Close {
  position: absolute;
  right: 0;
  top: 0;
  transform: translateY(-3rem);
  border-radius: 1rem;
  padding: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: $box-shadow-default;
  @extend .figma-glass;
  transition: 0.3s all ease-in-out;
  &:hover {
    transform: scale(1.03) translateY(-3rem);
  }
  &__icon {
    height: 1.5rem;
    width: 1.5rem;
  }
}
</style>
