/* eslint-disable dot-notation */
export default function ({ app, error }) {
  app.$axios.interceptors.request.use(
    (config) => {
      config.headers.token = app.$auth.getToken('spolive');
      return config;
    },
    (e) => {
      if (process.env.NODE_ENV !== 'production') {
        console.error('request-error', e);
      }
      return e;
    }
  );
}
