<template>
  <div class="Panel">
    <!-- <div class="orange-glow"></div> -->
    <!-- <div class="blue-glow"></div> -->
    <slot />
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.Panel {
  color: $gray-default;
  position: relative;
  min-height: 20rem;
  min-width: 30rem; // just to see something...!
  max-width: 90vw; // just to see something...!
  // border: 1px solid rgb(83, 83, 83);

  box-shadow: $box-shadow-default;
  border-radius: 1rem;
  @extend .white-glass;
  user-select: none;
}
// assumes corresponding panel is positioned relatively!
.custom-glow {
  position: absolute;
  z-index: -1;
  width: 0rem;
  height: 80%;
  opacity: 0.9;
  border-radius: 0.5rem;
  transform: rotate(5deg);
  pointer-events: none;
}
.blue-glow {
  @extend .custom-glow;
  box-shadow: 3.125rem 0rem 7.8125rem 1.5625rem rgb(169, 169, 169);
}
.orange-glow {
  @extend .custom-glow;
  right: 0;
  bottom: 0;
  box-shadow: -3.125rem 0rem 7.8125rem 1.5625rem #7c7c7cf7;
}
</style>
