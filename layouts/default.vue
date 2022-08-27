<template>
  <Nuxt />
</template>

<style lang="scss">
html,
body {
  background: white;
  user-select: none;
}

html,
body,
input,
textarea,
button {
  font-family: $secondary-font;
  font-weight: 400;
  font-size: 1rem;
  word-spacing: 0.0625rem;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  scroll-behavior: smooth;
}
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
.CustomLayoutNav {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1 !important;
}
</style>
