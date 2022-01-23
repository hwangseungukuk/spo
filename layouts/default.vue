<template>
  <div>
    <app-bar :menus="menus" :notices="getTopNotices"></app-bar>
    <div class="container flex">
      <main>
        <div v-if="!$auth.loggedIn" class="block-events"></div>
        <nuxt></nuxt>
      </main>
      <aside class="main-right">
        <template>
          <template v-if="$auth.loggedIn">
            <account-info
              :name="$auth.user.nickName"
              :messages="parseInt($auth.user.memo_not_read)"
              :golds="$auth.loggedIn ? $auth.user.spoGold : 0"
              :coins="$auth.loggedIn ? $auth.user.spoCoin : 0"
              :safebox="$auth.loggedIn ? getSafebox($auth.user.chest_gold) : 0"
              :deny-message="
                $auth.loggedIn
                  ? $auth.user.mb_deny_memo === '1' ||
                    $auth.user.mb_deny_memo === null
                  : false
              "
              :deny-chat="
                $auth.loggedIn
                  ? $auth.user.mb_deny_chat === '1' ||
                    $auth.user.mb_deny_chat === null
                  : false
              "
              :mb-deny-chat="$auth.user.mb_deny_chat"
              @charge="onChargeClick"
              @chat="onAllowChatChange"
              @message="onAllowMessageChange"
              @open-messages="openMessagesPopup"
              @safebox="openSafeboxPopup"
              @logout="onLogoutClick"
            ></account-info>
          </template>
          <template v-else>
            <login-button-container
              v-if="!isPmangLogin"
            ></login-button-container>
            <agreement-comp
              v-if="isPmangLogin"
              href="/api/views/member/pmang_agree.php?return_url=http://spolive.game.pmang.com/register"
            ></agreement-comp>
          </template>
        </template>
        <div
          :class="`pin-comps ${
            $auth.loggedIn ? (pinned ? 'pinned' : '') : 'pinned'
          }`"
        >
          <template v-if="showBetCart">
            <betting-cart
              v-if="$auth.loggedIn"
              :has-items="bettingCartItems.length > 0"
              :has-cancel-items="cancelableList.length > 0"
              :my-gold="$auth.loggedIn ? $auth.user.spoGold : 0"
              :rate="bettingCalcRate"
              :hold-folders="holdFolders"
              :request-betting="requestBetting"
              :count-same-bets="countSameBets"
              :checked-cancelable-select-all="cancelableSelectAll"
              :is-live-game-loading="isLiveGameLoading"
              @select-all="onSelectAllCancelableItemsChange"
              @mode="onModeChange"
              @betting="onBettingClick"
              @on-pinned="(v) => (pinned = v)"
              @on-hold-folders="(v) => (holdFolders = v)"
              @reset="clearBetCart"
              @cancel-reset="onCancelResetClick"
              @cancel-items="onCancelBetItemsClick"
            >
              <template v-slot:cart>
                <template v-for="(item, index) in bettingCartItems">
                  <betting-cart-item
                    :id="item.game === 'live' ? item.MatchId : item.id"
                    :key="generateKey(item, index)"
                    :game="item.game"
                    :type-name="
                      item.game === 'live'
                        ? item.MarketIdName
                        : getGameType(item.SRSMarketType).text
                    "
                    :type="
                      item.game === 'live'
                        ? item.MarketType
                        : item.SRSMarketType
                    "
                    :allotted="item.AllottedValue"
                    :outcome-id="item.OutcomeId"
                    :outcome="item.OutcomeIdName"
                    :detail="item.MatchInfo"
                    :rate="item.Rate"
                    :arrow="item.Arrow"
                    :active="item.game === 'live' ? item.Active : true"
                    @remove="onRemoveClick(item)"
                  ></betting-cart-item>
                </template>
              </template>
              <template v-slot:cancel>
                <betting-cancel-item
                  v-for="(item, index) in cancelableList"
                  :id="item.DrawId"
                  :key="`cancelable_item_${item.DrawId}_${index}`"
                  :type="item.DrawType"
                  :folders="item.Prediction.split(',').length"
                  :count="item.Gr_Cnt"
                  :rate="item.Odd"
                  :date="$moment(item.DateDrawn, $moment.ISO_8601).toDate()"
                  :expected="item.ExpectedWinSpoGold"
                  :checked="
                    checkedCancelables.some(
                      (cl) => cl.id === item.DrawId && cl.checked
                    )
                  "
                  @on-count-change="onCancelableItemCountChange"
                  @on-check-change="onCancelableItemChecked"
                  @detail="(v) => fetchCancelableItem(v)"
                >
                  <template v-slot:details>
                    <betting-cancel-item-detail
                      v-for="(detail, cDIndex) in getCancelableDetails(
                        item.DrawId
                      )"
                      :key="`cancelable-item-${cDIndex}-${detail.DrawId}`"
                      :type="detail.SRSMarketType"
                      :allotted="
                        detail.AllottedValue === 'None'
                          ? null
                          : parseFloat(detail.AllottedValue)
                      "
                      :home-name="
                        getTeamName(
                          detail.HomeTeam_UniqueId,
                          detail.HomeTeam_Name
                        )
                      "
                      :away-name="
                        getTeamName(
                          detail.AwayTeam_UniqueId,
                          detail.AwayTeam_Name
                        )
                      "
                      :label="detail.Prediction"
                      :rate="detail.AggregatedOdd"
                    ></betting-cancel-item-detail>
                  </template>
                </betting-cancel-item>
              </template>
            </betting-cart>
          </template>
          <casual-buttons @casual="onCasualClick"></casual-buttons>
          <chatting-container
            :p-notify-enter-user="chat.notifyEnterUser"
            :p-scroll-lock="chat.scrollLock"
            :is-logged-in="$auth.loggedIn"
            @share="onShareClick"
            @notify="onNotifyChange"
            @scroll="onScrollLockChange"
            @chat="sendChattingMessage"
          >
            <template v-for="(item, index) in chatItems">
              <chat-betting-item
                v-if="item.bet !== undefined && item.bet !== null"
                :key="`chat_bet_item_${index}_${item.userNick}`"
                :bet="item.bet"
                :user-id="item.loginId"
                :nickname="item.userNick"
                :message="item.msg"
                :selected="selectedChatIndex === index"
                @detail="onBettingDetailClick"
                @chatting="onChattingClick"
                @message="onMessageClick"
                @on-nickname-click="(v) => onNicknameClick({ ...v, index })"
              >
              </chat-betting-item>
              <chat-item
                v-else-if="item.loginId !== undefined && item.loginId !== null"
                :key="`chat_item_${index}_${item.userNick}`"
                :user-id="item.loginId"
                :nickname="item.userNick"
                :message="item.msg"
                :is-admin="item.sysLevel > 5"
                :selected="selectedChatIndex === index"
                @chatting="onChattingClick"
                @message="onMessageClick"
                @on-nickname-click="(v) => onNicknameClick({ ...v, index })"
                @reset="selectedChatIndex = null"
              ></chat-item>
              <chat-entered-item
                v-else
                :key="`chat_entered_item_${index}_${item.userNick}`"
                :message="item.msg"
              >
              </chat-entered-item>
            </template>
          </chatting-container>
          <div class="charge-buttons button-group flex">
            <button class="btn btn-lg charge free" @click="onFreeChargeClick">
              <i class="icon-svg free"></i>
              <span>골드 무료 충전</span>
            </button>
            <button
              class="btn btn-lg charge coupon"
              @click="onCouponChargeClick"
            >
              <i class="icon-svg coupon"></i>
              <span>쿠폰 충전소</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
    <app-footer></app-footer>
    <div class="header-bg"></div>
    <b-btn
      variant="info"
      :class="`scroll-top ${showTopButton ? 'show' : 'hide'}`"
      @click="onScrollTopClick"
    >
      <i class="icon-svg arrow scroll-top"></i>
    </b-btn>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import layoutMixin from '~/mixins/layout-mixin';
import casualMixin from '~/mixins/casual';
import chattingMixin from '~/mixins/chat';
import paymentMixin from '~/mixins/payment';

import betSaveCookieMixin from '~/mixins/hitgame/betting/cookie';

import BettingCart, {
  MODE_CANCEL,
} from '~/components/sidebar/betting/BettingCart';
import BettingCartItem from '~/components/sidebar/betting/BettingCartItem';

import BettingCancelItem from '~/components/sidebar/betting/BettingCancelItem';
import BettingCancelItemDetail from '~/components/sidebar/betting/BettingCancelItemDetail';

import { LIVE_GAME_LOADING, LIVE_GAME_LOADED } from '~/pages/hitgame/live.vue';

/** check neowiz pmang login */
const { mapState: pmangLoginState } = createNamespacedHelpers(
  'user/login/pmang'
);

const CODE_BETTING_NO_MORE_SPOGOLD = 402; // 스포골드 부족
const CODE_BETTING_DAY_SPENT_OVER = 451; // 베팅한도 초과
const CODE_BETTING_LIMITTED_OVER = 461; // 베팅한도 초과
const CODE_BETTING_EXPECTED_GOLDS_OVER = 462; // 예상획득 골드 초과

const { mapGetters: gameTypeGetters } = createNamespacedHelpers(
  'mapper/game-type'
);

const {
  mapState: bettingCartState,
  mapGetters: bettingCartGetters,
  mapActions: bettingCartActions,
} = createNamespacedHelpers('gamecenter/betting/cart');

const {
  mapState: cartCancelableState,
  mapGetters: cartCancelableGetters,
  mapActions: cartCancelableActions,
} = createNamespacedHelpers('gamecenter/betting/cart/cancel');

const {
  mapState: bettingCancelState,
  mapGetters: bettingCancelGetters,
  mapActions: bettingCancelActions,
} = createNamespacedHelpers('gamecenter/betting/cancel');

const { mapActions: _wsBettingActions } = createNamespacedHelpers(
  'gamecenter/betting/ws'
);

export default {
  components: {
    BettingCart,
    BettingCartItem,
    BettingCancelItem,
    BettingCancelItemDetail,
  },
  mixins: [
    chattingMixin,
    casualMixin,
    layoutMixin,
    betSaveCookieMixin,
    paymentMixin,
  ],
  data() {
    return {
      bettingCartItems: [],
      checkedCancelables: [],
      showTopButton: false,
      isLiveGameLoading: false,
    };
  },
  computed: {
    ...pmangLoginState({
      pmangLoggedIn: 'success',
      pmangLoginMessage: 'message',
      pmangLoginError: 'error',
      pmangLoginData: 'data',
      pmangLoginCode: 'code',
    }),
    ...gameTypeGetters(['getGameType']),
    ...cartCancelableState({
      hasCancelableList: 'hasList',
      cancelableList: 'items',
    }),
    ...cartCancelableGetters({
      getCancelableDetails: 'getDetails',
    }),
    ...bettingCartState({
      countSameBets: 'countSameBets',
      bettingItemsIsChanged: 'isChanged',
      bettingSuccess: 'success',
      bettingMessage: 'message',
      bettingError: 'error',
      _bettingCartItems: 'items',
      requestBetting: 'requesting',
      betResponseCode: 'code',
      overBetItem: 'overItem',
    }),
    ...bettingCartGetters({
      hasInactiveItems: 'hasInactiveItems',
      getBettingItemsType: 'getItemsType',
      getBettingCartItemSize: 'getSize',
      bettingCalcRate: 'getRate',
    }),
    ...bettingCancelState({
      isBetCancel: 'success',
      betCancelMessage: 'message',
      betCancelError: 'error',
      betCancelResultItems: 'items',
      cancelFrom: 'from',
    }),
    isPmangLogin() {
      return process.env.PMANG_LOGIN;
    },
    generateKey() {
      return (item, index) => {
        const {
          id,
          game,
          MatchId,
          MarketId,
          OutcomeId,
          SRSMarketType,
          SRSMarketId,
        } = item;
        return item.game === 'live'
          ? `betting-cart-item_${game}_${MatchId}_${MarketId}_${OutcomeId}_${index}`
          : `betting-cart-item_${id}_${game}_${SRSMarketType}_${OutcomeId}_${index}`;
      };
    },
    cancelableSelectAll() {
      if (this.checkedCancelables.some((item) => !item.checked)) {
        return false;
      }
      return true;
    },
    showBetCart() {
      const { name } = this.$route;
      if (!name) {
        return false;
      }
      return name.startsWith('hitgame') || name === 'index';
    },
  },
  watch: {
    overBetItem(v) {
      if (v === null) {
        return;
      }
      this.clearBetOverItem();
      this.showSingleButtonModal({
        message: '크로스 베팅은 한번에 최대 10폴더까지 저장할 수 있습니다.',
        description: null,
      });
    },
    $route() {
      this.holdFolders = true;
      this.clearBetCart();
      this.onSelectAllCancelableItemsChange(false);
      if (this.$auth.loggedIn) {
        this.$auth.fetchUser();
      }
    },
    bettingSuccess(v) {
      if (!v) {
        return;
      }
      if (this.holdFolders) {
        this.bettingCartItems = [...this._bettingCartItems];
      } else {
        this.clearBetCart();
        this.holdFolders = true;
        this.showDoubleButtonsModal({
          message:
            '베팅이 완료되었습니다. <br />적중 내역으로 이동하시겠습니까?',
          buttonConfirmText: '이동',
          onConfirm: () => {
            this.$router.push({ name: 'mypage-hitgame-srs' });
          },
        });
      }
    },
    betResponseCode(v) {
      if (v === 200 || v < 0) {
        return;
      }

      if (v === CODE_BETTING_NO_MORE_SPOGOLD) {
        this.showNoMoreSpogoldModal();
        return;
      }

      if (v === CODE_BETTING_DAY_SPENT_OVER) {
        this.showSingleButtonModal({
          message:
            '스포골드 일일 사용량을 초과하여 오늘 더 이상 구입하실 수 없습니다.<br />내일 다시 시도해주세요.',
          onConfirm: () => {
            this.clearBetCart();
          },
        });
        return;
      }

      if (
        v === CODE_BETTING_LIMITTED_OVER ||
        v === CODE_BETTING_EXPECTED_GOLDS_OVER
      ) {
        this.showSingleButtonModal({
          message:
            '축베팅 한도를 초과하여 더 이상 구입 하실 수 없습니다.<br />베팅내역을 확인해 주시기 바랍니다.',
          onConfirm: () => {
            this.clearBetCart();
          },
        });
        return;
      }

      this.showSingleButtonModal({
        message: '선택한 내용으로 베팅을 할 수 없습니다.',
        description:
          '마감된 경기가 포함되거나, 배당률이 변동된 게임이 존재 합니다.',
        onConfirm: () => {
          if (this.getBettingItemsType === 'live') {
            return;
          }
          this.clearBetCart();
        },
      });
    },
    _bettingCartItems(v) {
      this.bettingCartItems = [...v];
      if (this.$auth.loggedIn) {
        this.saveBetCartItems(this.$auth.user.accountno, v);
      }
    },
    cancelableList(v) {
      if (v === undefined || v === null || v.length <= 0) {
        return;
      }
      v.map((item) => {
        const foundedIndex = this.checkedCancelables.findIndex((cancelable) => {
          return cancelable.id === item.DrawId;
        });
        if (foundedIndex < 0) {
          this.checkedCancelables = [
            ...this.checkedCancelables,
            {
              id: item.DrawId,
              type: item.DrawType,
              checked: false,
              count: 0,
            },
          ];
        }
      });
    },
    betCancelResultItems(v) {
      if (this.cancelFrom !== 'cart') {
        return;
      }
      if (v.length <= 0) {
        return;
      }
      const failedList = v.filter((item) => {
        return !item.success;
      });
      if (failedList.length > 0) {
        this.showSingleButtonModal({
          message: '선택한 게임 중 일부 게임만 베팅 취소되었습니다.',
          description: `베팅 취소: ${
            v.length - failedList.length
          }건 , 베팅 취소 불가: ${failedList.length}건`,
          accent: '베팅 취소 조건에 부합하지 않는 경기가 포함되어 있습니다.',
          onConfirm: () => {
            this.clearBetCancelState();
          },
        });
      } else {
        this.showSingleButtonModal({
          message: '선택한 게임의 베팅이 취소되었습니다.',
          description: null,
          onConfirm: () => {
            this.clearBetCancelState();
          },
        });
      }
      this.getCancelableItems();
    },
  },
  mounted() {
    this.$nuxt.$on(LIVE_GAME_LOADING, () => {
      console.log(LIVE_GAME_LOADING);
      this.isLiveGameLoading = true;
    });
    this.$nuxt.$on(LIVE_GAME_LOADED, () => {
      console.log(LIVE_GAME_LOADED);
      this.isLiveGameLoading = false;
    });
    this.$timestamp.$on('timestamp', (v) => {
      const hasOverGame = this.bettingCartItems.some((item) => {
        if (item.game === 'live') {
          return false;
        }
        return v >= item.MatchDate.getTime();
      });
      if (!hasOverGame) {
        return;
      }
      this.clearBetCart();
      this.showSingleButtonModal({
        message: '베팅이 마감된 항목이 포함되어 있습니다.',
      });
    });
    this._connectBetWs();
    window.addEventListener('scroll', (v) => {
      this.showTopButton = window.scrollY >= 200;
    });
    if (this.pmangLoginCode === null || this.pmangLoginMessage === null) {
      return;
    }
    this._showUserStatusModal();
  },
  beforeDestroy() {
    this.$timestamp.$off('timestamp');
    this.$nuxt.$off(LIVE_GAME_LOADING);
    this.$nuxt.$off(LIVE_GAME_LOADED);
    this.clearBetCart();
    this.clearBetCancelState();
    this._disconnectBetWs();
    this._disconnectChatWs();
  },
  methods: {
    ..._wsBettingActions({
      _connectBetWs: 'connect',
      _disconnectBetWs: 'disconnect',
    }),
    ...cartCancelableActions({
      getCancelableItems: 'getCancelableItems',
      fetchCancelableItem: 'fetchCancelableItem',
      clearCancelable: 'clear',
    }),
    ...bettingCartActions({
      betting: 'betting',
      addBettingItem: 'addItem',
      resetFoundUpdateIds: 'resetFoundUpdateIds',
      clearSameBetCount: 'clearSameBetCount',
      clearBetOverItem: 'clearOverItem',
      _removeBettingItem: 'removeItem',
    }),
    ...bettingCancelActions({
      cancelBetItems: 'cancelItems',
      clearBetCancelState: 'clear',
    }),
    onCasualClick(v) {
      this.openCasualGame(v);
    },
    _showUserStatusModal() {
      const { pmangLoginMessage, pmangLoginCode, pmangLoginData } = this;
      this.showUserStatusModal({
        message: pmangLoginMessage,
        additionals: pmangLoginData,
        description:
          pmangLoginCode === 'MEMBER_LEAVE'
            ? '재가입 후 스포라이브를 다시 이용하실 수 있습니다.'
            : null,
        onConfirm: () => {
          console.log('confirm');
          if (!window.parent) {
            return;
          }
          window.parent.location.href = 'https://www.pmang.com';
        },
      });
    },
    onChargeClick() {
      this._openChargePage();
    },
    getSafebox(value) {
      return value === null ? 0 : parseInt(value);
    },
    onModeChange(v) {
      if (v !== MODE_CANCEL) {
        return;
      }
      this.onSelectAllCancelableItemsChange(false);
      this.getCancelableItems();
      // this.clearSameBetCount();
    },
    onBettingClick({ gold, expected, isExpectedOver }) {
      if (!this.$auth.loggedIn) {
        this.showPleaseLogInModal();
        return;
      }
      if (this.hasInactiveItems) {
        this.showSingleButtonModal({
          message: '선택한 내용으로 베팅을 할 수 없습니다.',
          description: '현재 카트에 담겨있는 베팅타입이 잠겨있습니다.',
        });
        return;
      }
      if (gold < 10000) {
        if (this.$auth.user.spoGold < 10000) {
          this.showNoMoreSpogoldModal();
        } else {
          this.showSingleButtonModal({
            message: '최소 베팅골드는 10,000 골드 입니다.',
            description: null,
          });
        }
        return;
      }
      if (isExpectedOver) {
        this.showSingleButtonModal({
          message:
            '예상 당첨 골드는 30,000,000,000 골드 이상<br />베팅이 불가능 합니다.',
          description: null,
        });
        return;
      }
      if (this.bettingItemsIsChanged) {
        this.showBettingConfirmModal({
          size: this.getBettingCartItemSize,
          rate: this.bettingCalcRate,
          gold,
          onConfirm: () => {
            this.betting(gold);
            setTimeout(() => {
              this.$jquery('.btn.do-betting').focus();
            }, 100);
          },
        });
      } else {
        this.betting(gold);
      }
    },
    onSelectAllCancelableItemsChange(v) {
      this.checkedCancelables = this.checkedCancelables.map((cl) => {
        return {
          ...cl,
          checked: v,
        };
      });
    },
    onRemoveClick(v) {
      console.log(v);
      this._removeBettingItem(v);
      this.$nuxt.$emit('removeBetCartItem', v);
    },
    clearBetCart() {
      this._clearBetCarts();
      this.$nuxt.$emit('clearBetCart');
    },
    onCancelableItemCountChange(v) {
      const foundedIndex = this.checkedCancelables.findIndex((cancelable) => {
        return cancelable.id === v.id && cancelable.type === v.type;
      });
      if (foundedIndex < 0) {
        return;
      }
      this.checkedCancelables[foundedIndex].checked = v.checked;
      this.checkedCancelables[foundedIndex].count = v.count;
    },
    onCancelableItemChecked({ id, type, checked, count }) {
      const foundedIndex = this.checkedCancelables.findIndex((cancelable) => {
        return cancelable.id === id && cancelable.type === type;
      });
      if (foundedIndex < 0) {
        return;
      }
      this.checkedCancelables[foundedIndex].checked = checked;
      this.checkedCancelables[foundedIndex].count = count;
    },
    onCancelResetClick() {
      this.checkedCancelables = this.checkedCancelables.map((item) => {
        return {
          ...item,
          count: 1,
          checked: false,
        };
      });
    },
    onCancelBetItemsClick() {
      let cancelList = [];
      const targets = this.checkedCancelables.filter((item) => {
        return item.checked && item.count > 0;
      });
      this.cancelableList.map((item) => {
        const target = targets.find((target) => target.id === item.DrawId);
        if (target) {
          cancelList = [
            ...cancelList,
            ...item.Gr_DrawId.split(',')
              .slice(0, target.count)
              .map((grItem) => {
                return `${item.DrawType}|${grItem}`;
              }),
          ];
        }
      });
      if (cancelList.length <= 0) {
        this.showSingleButtonModal({
          message: '취소할 베팅 게임을 선택해 주세요.',
          description: null,
        });
        return;
      }
      this.showDoubleButtonsModal({
        message: '선택한 게임을 베팅 취소하시겠습니까?',
        accent: `선택한 게임 수 : ${cancelList.length} 게임`,
        buttonConfirmText: '베팅취소',
        buttonCancelText: '닫기',
        onConfirm: () => {
          this.cancelBetItems({ type: 'SRS', items: cancelList, from: 'cart' });
        },
      });
    },
    onScrollTopClick() {
      this.$jquery('html, body').animate(
        {
          scrollTop: 0,
        },
        500
      );
    },
    showNoMoreSpogoldModal() {
      this.showDoubleButtonsModal({
        message:
          '스포골드가 부족하여 배팅을 할 수 없습니다.<br />상점으로 이동하시겠습니까?',
        buttonConfirmText: '이동',
        description: null,
        accent: null,
        onConfirm: () => {
          this.$router.push({ name: 'store' });
        },
      });
    },
    async onLogoutClick() {
      this._disconnectBetWs();
      this._disconnectChatWs();
      await this.$auth.logout();
      if (process.env.PMANG_LOGIN) {
        parent.doLogout();
      }
      this.clearBetCart();
      this._connectBetWs();
      this._joinRoom();
    },
    onFreeChargeClick() {
      this._openChargePopup('freecharge', 'freecharge/popup_freegold.php');
    },
    onCouponChargeClick() {
      this._openChargePopup('coupon', 'coupon/popup_coupon.php');
    },
    _openChargePopup(name, url) {
      const options =
        'top=300, left=300, width=500, height=500, status=no, menubar=no, toolbar=no, resizable=no, scrollbars=no';
      const _url = `/api/views/${url}?callback_fn=_gold_charge_completed`;
      window.open(_url, `charge_popup_${name}`, options);
    },
  },
};
</script>

<style scoped>
div.container {
  position: relative;
}

img.game-start {
  margin: 20px 0 35px;
}

img.game-start:hover {
  cursor: pointer;
}

div.pin-comps {
  position: sticky;
  top: -5px;
}

div.pin-comps.pinned {
  position: initial;
}

.btn.scroll-top {
  position: fixed;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  bottom: 50px;
  left: 50%;
  margin-left: 652px;
  transition: transform 0.3s, opacity 0.3s;
}

.btn.scroll-top.show {
  transform: translateY(0);
  opacity: 1;
}

.btn.scroll-top.hide {
  transform: translateY(200%);
  opacity: 0;
}

.btn.btn.scroll-top .icon-svg {
  background-color: white;
  width: 15px;
  height: 15px;
}

.btn.btn.scroll-top:focus {
  background-color: #3eb2c0;
  outline: unset;
  box-shadow: unset;
}

.charge-buttons {
  justify-content: space-between;
  margin-bottom: 20px;
}

.btn.charge {
  border-radius: unset;
  flex: 1;
  min-width: 170px;
  height: 80px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  color: white;
  font-size: 16px;
  font-weight: 800;
  padding: 0;
}

.btn.charge .icon-svg {
  display: block;
  margin: 0 auto 5px;
}

.btn.charge:not(:last-of-type) {
  margin-right: 10px;
}

.btn.charge.free {
  background-image: url(~assets/images/side/charge/btn_bg1.png);
}

.btn.charge.free .icon-svg.free {
  width: 33px;
  height: 28px;
  -webkit-mask-image: url(~assets/icons/charge/icon-charge-free.svg);
  mask-image: url(~assets/icons/charge/icon-charge-free.svg);
  background-color: white;
}

.btn.charge.coupon {
  background-image: url(~assets/images/side/charge/btn_bg2.png);
}

.btn.charge.coupon .icon-svg.coupon {
  width: 38px;
  height: 32px;
  -webkit-mask-image: url(~assets/icons/charge/icon-charge-coupon.svg);
  mask-image: url(~assets/icons/charge/icon-charge-coupon.svg);
  background-color: white;
}

@media screen and (max-width: 1320px) {
  .btn.scroll-top {
    margin-left: 0;
    right: 15px;
    left: auto;
  }
}
</style>
