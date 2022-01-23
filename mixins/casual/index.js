import { createNamespacedHelpers } from 'vuex';

const {
  mapState: casualTokenState,
  mapActions: casualTokenActions,
} = createNamespacedHelpers('gamecenter/casual/token');

export default {
  computed: {
    ...casualTokenState({
      isRegistered: 'success',
      code: 'code',
      error: 'error',
    }),
  },
  methods: {
    ...casualTokenActions({ applyToken: 'applyToken' }),
    openCasualGame(game) {
      this._createCasualWindow(this.$auth.getToken('spolive'), game);
    },
    _createCasualWindow(token, game) {
      const formName = 'casualForm';
      const url = process.env.CASUAL_TOKEN_URL;
      const options =
        'top=150, left=150, width=1520, height=1100, status=no, menubar=no, toolbar=no, resizable=no, scrollbars=no';
      const form = document.createElement('form');
      form.setAttribute('method', 'post');
      form.setAttribute('action', url);
      form.setAttribute('target', formName);

      form.appendChild(this._createCasualInputField('token', token));
      form.appendChild(this._createCasualInputField('game', game));

      document.body.appendChild(form);
      window.open('', formName, options);
      form.target = formName;
      form.submit();
      document.body.removeChild(form);
    },
    _createCasualInputField(key, value) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      return input;
    },
  },
};
