export default {
  methods: {
    openMessagesPopup(nickname) {
      const options =
        'top=30, left=30, width=710, height=655, status=no, menubar=no, toolbar=no, resizable=no, scrollbars=no';
      if (nickname) {
        window.open(`/messages/write?t=${nickname}`, 'messages', options);
      } else {
        window.open('/messages', 'messages', options);
      }
    },
    openRandomMessagesPopup() {
      const options =
        'top=30, left=30, width=710, height=655, status=no, menubar=no, toolbar=no, resizable=no, scrollbars=no';
      window.open('/messages/random', 'messages', options);
    },
    openChatPopup(invite, toid) {
      let to = '';
      if (toid) {
        to = '?toid=' + toid;
      }
      const options =
        'top=30, left=30, width=400, height=555, status=no, menubar=no, toolbar=no, resizable=no, scrollbars=no';
      window.open(`/chat/${invite}` + to, 'messages', options);
    },
  },
};
