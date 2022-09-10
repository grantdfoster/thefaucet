<template>
  <div>
    <Nav />
    <Nuxt />
    <Dashboard />
  </div>
</template>

<style lang="scss">
// this app will not scroll
html,
body {
  background: white;
  width: auto !important;
  overflow-x: hidden !important;
  overflow-y: hidden !important;
}

html,
body,
input,
textarea,
button {
  font-weight: 400;
  font-family: $default-font;
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
