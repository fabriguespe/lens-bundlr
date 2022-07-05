export default {
  ssr:false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'lens-app',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  css: [
  ],
  plugins: [
    '@/plugins/utils',
    '@/plugins/bootstrap-vue',
  ],
  components: true,

  buildModules: [
  ],
  modules: [
  ],
  build: {
  }
}
