<template>
  <div class="Panel">
    <slot />
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.Panel {
  @extend .white-glass;
  // background: white;
  color: $gray-default;
  box-shadow: $box-shadow-default;
  border-radius: 1rem;
  height: 75vh;
  width: 90vw;
}
</style>
