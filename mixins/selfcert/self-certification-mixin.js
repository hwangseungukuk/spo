export default {
  methods: {
    openSelfCertPopup(module, type) {
      const options =
        'top=100, left=100, width=520, height=650, status=no, menubar=no, toolbar=no, resizable=no, scrollbars=no';
      const url = `/api/views/auth/auth_${module}.php?callback_fn=_self_certification&type=${type}`;
      window.open(url, 'spolive_match_info', options);
    },
    onSelfCertReceivePostMessage({ data }) {
      if (data.from !== 'selfCert') {
        return;
      }
      const { token } = data;
      this.selfCertToken = token;
    },
  },
};
