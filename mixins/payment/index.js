export default {
  methods: {
    _openChargePage() {
      const options =
        'top=100, left=100, width=700, height=650, status=no, menubar=no, toolbar=no, resizable=no, scrollbars=no';
      const url = `/api/views/payment/payment.php?callback_fn=_charge_completed`;
      window.open(url, 'spolive_match_info', options);
    },
  },
};
