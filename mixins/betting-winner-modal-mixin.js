import BettingWinnerModal, {
  MODAL_OPTIONS as BWM_MODAL_OPTIONS,
} from '~/components/modals/betting/BettingWinnerModal';

export default {
  methods: {
    showBettingWinnerModal(hitlist) {
      this.$modal.show(
        BettingWinnerModal,
        {
          list: hitlist,
          onCancel: () => {
            this.$auth.fetchUser();
          },
        },
        BWM_MODAL_OPTIONS
      );
    },
  },
};
