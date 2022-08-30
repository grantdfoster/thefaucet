<template>
  <div class="Panel">
    <slot />
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.Panel {
  @extend .white-glass;
  color: $gray-default;
  box-shadow: $box-shadow-default;
  border-radius: 1rem;
}
</style>
