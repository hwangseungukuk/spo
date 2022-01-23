import moment from 'moment';
const env = require('dotenv').config();

const getProxyConfig = () => {
  const isDev = process.env.NODE_ENV === 'development';
  const config = {
    '/api/': {
      target: `${process.env.API_BASE_URL}/${process.env.API_VERSION}`,
      pathRewrite: { '^/api/': '' },
    },
  };
  if (isDev) {
    config['/srs/'] = {
      target: process.env.SRS_URL,
      pathRewrite: { '^/srs/': '' },
    };
  }
  return config;
};

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  server: {
    host: '0.0.0.0',
    port: process.env.SERVICE_PORT || 5555,
  },
  loading: {
    color: '#3eb2c0',
    height: '5px',
  },
  ssr: false,
  env: {
    ...env.parsed,
    SRS_CURRENT_URL:
      process.env.NODE_ENV === 'development' ? '/srs/' : process.env.SRS_URL,
    STORE_IMAGE_URL: process.env.IMAGE_MAIN_PATH || 'https://dev.spolive.com',
    CASUAL_TOKEN_URL:
      process.env.CASUAL_SPOLIVE_TOKEN_URL ||
      'https://www.spolive.com/api/token.php',
    PMANG_LOGIN: process.env.CONF_PMANG_LOGIN === 'true',
    IS_TEST_SERVER: process.env.CONF_IS_TEST_SERVER === 'true',
  },
  dir: {
    api: 'api',
    assets: 'assets',
    app: 'app',
    layouts: 'layouts',
    middleware: 'middleware',
    pages: 'pages',
    static: 'static',
    store: 'store',
    util: 'util',
  },
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Spolive',
    meta: [
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0',
      },
      {
        hid: 'description',
        name: 'description',
        content: '',
      },
      { charset: 'utf-8' },
      { hid: 'description', name: 'description', content: '' },
      /**
       * Open graph tags
       */
      {
        hid: 'og:site_name',
        name: 'og:site_name',
        property: 'og:site_name',
        content: 'SPOLIVE',
      },
      {
        hid: 'og:title',
        name: 'og:title',
        property: 'og:title',
        content: 'SPOLIVE',
      },
      {
        hid: 'og:type',
        name: 'og:type',
        property: 'og:type',
        content: 'website',
      },
      {
        hid: 'og:url',
        name: 'og:url',
        property: 'og:url',
        content: 'http://spolive.com',
      },
      {
        hid: 'og:image',
        name: 'og:image',
        property: 'og:image',
        content: '/app/favicon/android-icon-192x192.png',
      },
      {
        hid: 'og:description',
        name: 'og:description',
        property: 'og:description',
        content: '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src:
          'https://widgets.sir.sportradar.com/986b902c5362ab6c57e3ca1c8c128f2c/widgetloader',
        'data-sr-language': 'ko',
        'data-sr-theme': 'false',
        async: 'true',
      },
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  // eslint-disable-next-line prettier/prettier
  css: [
    '~assets/css/index.css',
    '~assets/css/betting.css',
    '~assets/css/match-tracker.css',
  ],
  router: {
    middleware: [
      // 'check-maintenance',
      'pmang-login-check',
      'get-info-data',
      'load-main-data',
      'auth',
    ],
    scrollBehavior(to, from, savedPosition) {
      return { x: 0, y: 0 };
    },
  },

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/global-mixins.js',
    '~/plugins/init-moment.js',
    '~/plugins/init-lz-string.js',
    '~/plugins/init-jquery.js',
    '~/plugins/vue-js-modal.js',
    '~/plugins/init-quill-editor.js',
    '~/plugins/axios-interceptor.js',
    '~/plugins/get-current-timestamp.js',
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: false,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    'cookie-universal-nuxt',
  ],
  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    proxy: process.env.ENABLED_AXIOS_PROXY === 'true',
    debug: process.env.ENABLED_AXIOS_DEBUG === 'true',
    credentials: process.env.ENABLED_AXIOS_CREDENTIALS === 'true',
  },
  // proxy
  proxy: {
    ...getProxyConfig(),
  },
  // auth-module
  // https://auth.nuxtjs.org/
  auth: {
    fullPathRedirect: true,
    strategies: {
      spolive: {
        _scheme: '~/schemes/SpoliveScheme',
        autoFetchUser: false,
        endpoints: {
          login: {
            url: '/api/member/login.php',
            method: 'post',
            propertyName: 'data.token',
          },
          // logout: {
          //   url: '/api/views/member/pmang_logout.php',
          //   method: 'get',
          // },
          logout: false,
          user: {
            url: '/api/member/userinfo.php',
            method: 'post',
            propertyName: 'data',
          },
        },
        tokenType: '',
        tokenRequired: true,
      },
    },
    redirect: {
      login: '/login',
      callback: false,
      home: '/',
      logout: '/',
    },
    cookie: {
      maxAge: 30 * 24 * 60 * 60, // DAY * HOURS * MINS * SECONDS
    },
    localStorage: {},
    defaultStrategy: 'spolive',
  },
  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    transpile: ['@nuxtjs/auth'],
    filenames: {
      manifest: ({ isDev }) => {
        return isDev
          ? 'manifest/[name].js'
          : process.env.IS_TEST_SERVER
          ? `manifest/[name].[contenthash:7].js`
          : `manifest/[name].${moment().format('YYYYMMDD')}.js`;
      },
      vendor: ({ isDev }) =>
        isDev
          ? 'vendor/[name].js'
          : process.env.IS_TEST_SERVER
          ? `vendor/[name].[contenthash:7].js`
          : `vendor/[name].${moment().format('YYYYMMDD')}.js`,
      app: ({ isDev, isModern }) =>
        isDev
          ? `app/[name]${isModern ? '.modern' : ''}.js`
          : process.env.IS_TEST_SERVER
          ? `app/[name]${isModern ? '.modern' : ''}.[contenthash:7].js`
          : `app/[name]${isModern ? '.modern' : ''}.${moment().format(
              'YYYYMMDD'
            )}.js`,
      chunk: ({ isDev, isModern }) =>
        isDev
          ? `chunk/[name]${isModern ? '.modern' : ''}.js`
          : process.env.IS_TEST_SERVER
          ? `chunk/[name]${isModern ? '.modern' : ''}.[contenthash:7].js`
          : `chunk/[name]${isModern ? '.modern' : ''}.${moment().format(
              'YYYYMMDD'
            )}.js`,
      css: ({ isDev }) =>
        isDev
          ? 'css/[name].css'
          : process.env.IS_TEST_SERVER
          ? `css/[name].[contenthash:7].css`
          : `css/[name].${moment().format('YYYYMMDD')}.css`,
      img: ({ isDev }) =>
        isDev
          ? 'img/[name].[ext]'
          : process.env.IS_TEST_SERVER
          ? `img/[name].[contenthash:7].[ext]`
          : `img/[name].${moment().format('YYYYMMDD')}.[ext]`,
      md: ({ isDev }) =>
        isDev
          ? 'md/[name].[ext]'
          : process.env.IS_TEST_SERVER
          ? `md/[name].[contenthash:7].[ext]`
          : `md/[name].${moment().format('YYYYMMDD')}.[ext]`,
      html: ({ isDev }) =>
        isDev
          ? 'html/[name].[ext]'
          : process.env.IS_TEST_SERVER
          ? `html/[name].[contenthash:7].[ext]`
          : `html/[name].${moment().format('YYYYMMDD')}.[ext]`,
    },
    extractCSS: {
      ignoreOrder: true,
    },
    extend(config, ctx) {
      config.node = {
        fs: 'empty',
      };
    },
    loaders: {
      vue: {
        compilerOptions: {
          preserveWhitespace: false,
        },
      },
    },
    terser: {
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
  },
  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => {
        return ['script', 'style', 'font', 'img'].includes(type);
      },
    },
  },
};
