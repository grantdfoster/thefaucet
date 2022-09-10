// set up provider and necessary setup
export default (context, _inject) => {
  context.store.dispatch('metamask/initProvider')
}
