import CommonSingleButtonModal, {
  MODAL_OPTIONS as CSB_MODAL_OPTIONS,
  MODAL_OPTIONS_SMALL as CSB_MODAL_OPTIONS_SMALL,
} from '~/components/modals/CommonSingleButtonModal';

import CommonDoubleButtonModal, {
  MODAL_OPTIONS as CDB_MODAL_OPTIONS,
} from '~/components/modals/CommonDoubleButtonsModal';

import BettingConfirmModal, {
  MODAL_OPTIONS as BCM_MODAL_OPTIONS,
} from '~/components/modals/betting/BettingConfirmModal';

import SelectHistoriesModal, {
  MODAL_OPTIONS as SHSM_MODAL_OPTIONS,
} from '~/components/modals/histories/SelectHistoriesModal';

import SaleDoubleButtonModal, {
  MODAL_OPTIONS as SDM_MODAL_OPTIONS,
} from '~/components/modals/trades/SaleDoubleButtonModal';

import NickNameMessageModal, {
  MODAL_OPTIONS as NNM_MODAL_OPTIONS,
} from '~/components/modals/nickname/NicknameMessageModal';

import BettingShareModal, {
  MODAL_OPTIONS as BSM_MODAL_OPTIONS,
} from '~/components/modals/betting/share/BettingShareModal';

import BuyItemConfirmModal, {
  MODAL_OPTIONS as BICM_MODAL_OPTIONS,
} from '~/components/modals/store/BuyItemConfirmModal';

import WithdrawalModal, {
  MODAL_OPTIONS as WM_MODAL_OPTIONS,
} from '~/components/modals/inventory/WithdrawalModal';

import BuyItemSuccessfulModal, {
  MODAL_OPTIONS as BISM_MODAL_OPTIONS,
} from '~/components/modals/store/BuyItemSuccessfulModal';

import BuySkinSuccessfulModal, {
  MODAL_OPTIONS as BSSM_MODAL_OPTIONS,
} from '~/components/modals/store/BuySkinSuccessfulModal';

import BuyDoubleButtonModal, {
  MODAL_OPTIONS as BDBM_MODAL_OPTIONS,
} from '~/components/modals/trades/BuyDoubleButtonModal';

import PolicyModal, {
  MODAL_OPTIONS as REGISTER_MODAL_OPTIONS,
} from '~/components/modals/register/PolicyModal';

import UserStatusModal, {
  MODAL_OPTIONS as USM_MODAL_OPTIONS,
} from '~/components/modals/user/UserStatusModal';

import GameInfoModal, {
  MODAL_OPTIONS as GIM_MODAL_OPTIONS,
} from '~/components/modals/gameinfo/GameInfoModal';

/**
 * Survey
 */

import HasSurveyModal, {
  MODAL_OPTIONS as HAS_SURVEY_MODAL_OPTIONS,
} from '~/components/modals/survey/HasSurveyModal';

import SurveyModal, {
  MODAL_OPTIONS as SURVEY_MODAL_OPTIONS,
} from '~/components/modals/survey/SurveyModal';

export default {
  methods: {
    showPleaseLogInModal() {
      this.showSingleButtonModal({
        message: '로그인 후 이용해 주세요.',
        description: null,
      });
    },
    showBettingConfirmModal({ size, rate, gold, onConfirm, onCancel }) {
      this.$modal.show(
        BettingConfirmModal,
        {
          size,
          rate,
          gold,
          onConfirm,
          onCancel,
        },
        BCM_MODAL_OPTIONS
      );
    },
    showSingleButtonModal({
      small,
      message,
      description,
      accent,
      timer,
      buttonText,
      onConfirm,
    }) {
      this.$modal.show(
        CommonSingleButtonModal,
        {
          message,
          description,
          accent,
          timer,
          buttonText,
          onConfirm,
          small,
        },
        small ? CSB_MODAL_OPTIONS_SMALL : CSB_MODAL_OPTIONS
      );
    },
    showDoubleButtonsModal({
      message,
      description,
      accent,
      accentTypeBg,
      accentPoint,
      timer,
      buttonConfirmText,
      buttonCancelText,
      onConfirm,
      onCancel,
    }) {
      this.$modal.show(
        CommonDoubleButtonModal,
        {
          message,
          description,
          accent,
          accentTypeBg,
          accentPoint,
          timer,
          buttonConfirmText,
          buttonCancelText,
          onConfirm,
          onCancel,
        },
        CDB_MODAL_OPTIONS
      );
    },
    showSaleButtonsModal({
      message,
      description,
      rate,
      golds,
      expected,
      buttonConfirmText,
      buttonCancelText,
      onConfirm,
      onCancel,
    }) {
      this.$modal.show(
        SaleDoubleButtonModal,
        {
          message,
          description,
          rate,
          golds,
          expected,
          buttonConfirmText,
          buttonCancelText,
          onConfirm,
          onCancel,
        },
        SDM_MODAL_OPTIONS
      );
    },
    showNicknameMessageModal({
      message,
      description,
      accent,
      itNo,
      caId,
      inputBox,
      buttonConfirmText,
      buttonCancelText,
      onConfirm,
      onCancel,
    }) {
      this.$modal.show(
        NickNameMessageModal,
        {
          message,
          description,
          accent,
          itNo,
          caId,
          inputBox,
          buttonConfirmText,
          buttonCancelText,
          onConfirm,
          onCancel,
        },
        NNM_MODAL_OPTIONS
      );
    },
    showSelectHistoriesModal({ isShareMode, onSelected }) {
      this.$modal.show(
        SelectHistoriesModal,
        {
          isShareMode,
          onSelected,
        },
        SHSM_MODAL_OPTIONS
      );
    },
    showBettingShareModal({ nickname, bet }) {
      this.$modal.show(
        BettingShareModal,
        {
          nickname,
          bet,
        },
        BSM_MODAL_OPTIONS
      );
    },
    showBuyConfirmModal({ name, count, gold, price, onConfirm }) {
      this.$modal.show(
        BuyItemConfirmModal,
        {
          itemName: name,
          itemCount: count,
          itemPrice: price,
          spoGold: gold,
          onConfirm,
        },
        BICM_MODAL_OPTIONS
      );
    },
    showWithdrawalModal({ itName, itCnt, itemPrice, onConfirm }) {
      this.$modal.show(
        WithdrawalModal,
        {
          itName,
          itCnt,
          itemPrice,
          onConfirm,
        },
        WM_MODAL_OPTIONS
      );
    },
    showBuySuccessfulModal({ name, onConfirm }) {
      this.$modal.show(
        BuyItemSuccessfulModal,
        {
          itemName: name,
          onConfirm,
        },
        BISM_MODAL_OPTIONS
      );
    },
    showBuySkinSuccessfulModal({ name, onConfirm, onCancel }) {
      this.$modal.show(
        BuySkinSuccessfulModal,
        {
          itemName: name,
          onConfirm,
          onCancel,
        },
        BSSM_MODAL_OPTIONS
      );
    },
    showBuyDoubleButtonModal({ num, gold }) {
      this.$modal.show(
        BuyDoubleButtonModal,
        {
          itemNumber: num,
          itemGold: gold,
        },
        BDBM_MODAL_OPTIONS
      );
    },
    showPolicyModal({ title, text }) {
      this.$modal.show(
        PolicyModal,
        {
          title,
          text,
        },
        REGISTER_MODAL_OPTIONS
      );
    },
    showUserStatusModal({ message, additionals, description, onConfirm }) {
      this.$modal.show(
        UserStatusModal,
        {
          message,
          additionals,
          description,
          onConfirm,
        },
        USM_MODAL_OPTIONS
      );
    },
    showSurveyModal() {
      // eslint-disable-next-line prettier/prettier
      this.$modal.show(
        SurveyModal,
        null,
        SURVEY_MODAL_OPTIONS
      );
    },
    showHasSurveyModal({
      image,
      message,
      description,
      onConfirm,
      onConfirmText,
      onCancelText,
    }) {
      // eslint-disable-next-line prettier/prettier
      this.$modal.show(
        HasSurveyModal,
        {
          image,
          description,
          message,
          onConfirm,
          onConfirmText,
          onCancelText,
        },
        HAS_SURVEY_MODAL_OPTIONS
      );
    },
  },
};
