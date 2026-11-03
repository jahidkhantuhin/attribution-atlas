import colors from 'vuetify/es5/util/colors'

const appName = process.env.APP_NAME || 'Attribution Atlas'
const organizationName = process.env.ORGANIZATION_NAME || appName
const organizationEmailDomain =
  process.env.ORGANIZATION_EMAIL_DOMAIN || 'example.com'
const organizationLogoUrl = process.env.ORGANIZATION_LOGO_URL || ''
const apiBaseUrl = (
  process.env.API_BASE_URL || 'https://api.example.com/api/v1'
).replace(/\/+$/, '')
const appBaseUrl = (
  process.env.APP_BASE_URL || 'http://localhost:8088'
).replace(/\/+$/, '')
const googleClientId = process.env.GOOGLE_CLIENT_ID || ''
const googleOAuthRedirectUri =
  process.env.GOOGLE_OAUTH_REDIRECT_URI || `${appBaseUrl}/social-login`
const demoMode = process.env.DEMO_MODE === 'true'

const axiosConfig = {
  baseURL: apiBaseUrl,
  withCredentials: true,
}

export default {
  // server: {
  //   port: 8088 // default: 3000
  // },
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: `%s - ${appName}`,
    title: appName,
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: '~/plugins/demoApi.js', mode: 'client' }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/composition-api/module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: axiosConfig,

  publicRuntimeConfig: {
    appName,
    organizationName,
    organizationEmailDomain,
    organizationLogoUrl,
    googleLoginEnabled: Boolean(googleClientId),
    demoMode,
    axios: {
      browserBaseURL: apiBaseUrl,
    },
  },

  privateRuntimeConfig: {
    axios: axiosConfig,
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#2457e6',
          accent: '#13b8a6',
          secondary: '#17233d',
          info: '#13b8a6',
          warning: '#f5a623',
          error: '#e65f59',
          success: '#11a579',
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  router: {
    // middleware: ['isAuthenticated']
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'custom',
        path: '*',
        component: resolve(__dirname, 'pages/404.vue')
      })
    }
  },

  auth: {
    watchLoggedIn: true,
    rewriteRedirects: true,
    fullPathRedirect: true,
    // plugins custom made for CA
    plugins: [],
    // stategum
    strategies: {
      local: {
        token: {
          property: 'data.token',
          global: true,
          required: true,
          type: 'Bearer'
        },
        user: {
          property: false,
          autoFetch: true
        },
        endpoints: {
          login: { url: `${apiBaseUrl}/login`, method: 'post', propertyName: "data.token"},
          logout: { url: `${apiBaseUrl}/logout`, method: 'post' },
          user: { url: `${apiBaseUrl}/user`, method: 'get', propertyName: "data.user"}
        }
      },
      google: {
        clientId: googleClientId,
        codeChallengeMethod: '',
        responseType: 'code',
        redirectUri: googleOAuthRedirectUri,
        token: {
          property: 'data.token',
          global: true,
          required: true,
          type: 'Bearer'
        },
        userInfo: {
          property: false,
          autoFetch: true
        },
        endpoints: {
          token: `${apiBaseUrl}/social-login`, // backend endpoint that exchanges the Google response for an app token
          userInfo: '/user?noswal' // the endpoint to get the user info after you received the token 
        },
      },
    },
    redirect: false,
  },
}
