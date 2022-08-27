export default ({ store }, _inject) => {
  store.dispatch('window/resized', window.innerWidth)
  window.onresize = () => {
    store.dispatch('window/resized', window.innerWidth)
  }
}
