export default {
  methods: {
    openSafeboxPopup() {
      const options =
        'top=50, left=50, width=501, height=356, status=no, menubar=no, toolbar=no, resizable=no, scrollbars=no';
      window.open('/safebox', 'safebox', options);
    },
  },
};
