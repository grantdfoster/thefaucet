export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  ssr: false, // Disable Server Side rendering
  env: {
    DRIPTOKEN: process.env.DRIPTOKEN,
    FAUCETCONTRACT: process.env.FAUCETCONTRACT,
  },
  server: {
    port: '3000',
  },
  target: 'static',
  head: {
    title: 'TheFaucet',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        href: 'https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp',
        rel: 'stylesheet',
      },
    ],
    script: [],
  },
  css: ['./styles/main.scss', './styles/fonts.scss'],
  plugins: [
    { src: './plugins/window.js', ssr: false },
    { src: './plugins/slider.js', ssr: false },
    { src: './plugins/metamask.js', ssr: false },
  ],
  components: true,
  buildModules: ['@nuxtjs/composition-api/module', '@nuxt/typescript-build', '@nuxtjs/style-resources'],
  modules: ['@nuxtjs/toast'],
  toast: {
    position: 'top-center',
  },
  build: {
    // this allows nuxt to load other formats...
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.(ogg|pdf|mp3|wav|mpe?g)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      })
    },
  },
  styleResources: {
    scss: ['./styles/main.scss', './styles/fonts.scss'],
  },
}
