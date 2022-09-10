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
  right: 1rem;
  top: 1rem;
  // transform: translateY(-3rem);
  border-radius: 1rem;
  padding: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  // box-shadow: $box-shadow-default;
  @extend .white-glass;
  transition: 0.3s all ease-in-out;
  z-index: 3;
  // &:hover {
  //   transform: scale(1.1) translateY(-3rem);
  // }
  &__icon {
    height: 1.5rem;
    width: 1.5rem;
  }
}
</style>
