<template>
  <div class="white_cover">
    <button-tabs
      :items="labelTabs"
      :value="status"
      @change="(v) => (status = v)"
    ></button-tabs>
    <div class="history-list">
      <div class="store-content default-ctn">
        <inventory-board-container
          :page="currentPage"
          :total-items="totalItems"
          :loading="loading"
          @page="({ page }) => (currentPage = page)"
        >
          <template v-if="items.length > 0 && !loading">
            <inventory-board-item
              v-for="(item, index) in items"
              :id="item.it_id"
              :key="`board_item_${item.it_id}_${index}`"
              :skin-index="null"
              :it-no="item.it_no"
              :ca-id="item.ca_id3"
              :ca-id2="item.ca_id"
              :it-name="item.it_name"
              :ct-qty="item.it_useCnt"
              :it-img1="item.it_img1"
              :is-using="null"
              :unit-txt="item.unit_txt"
              :item-use-type="item.item_use_type"
              @click="onUse"
              @withdrawal="onWithdrawal"
            ></inventory-board-item>
          </template>
          <template v-else-if="items.length <= 0 && !loading">
            <div class="no-has-items default-ctn flex">
              <p>보유한 아이템이 없습니다.</p>
            </div>
          </template>
          <template v-else>
            <inventory-board-item-skeleton
              v-for="index in 9"
              :key="`board_item_sk_${currentPage}_${index}`"
            ></inventory-board-item-skeleton>
          </template>
        </inventory-board-container>
      </div>
    </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';

import ButtonTabs from '~/components/common/ButtonTabs';

import InventoryBoardContainer from '~/components/mypage/inventory/InventoryBoardContainer';
import InventoryBoardItem from '~/components/mypage/inventory/InventoryBoardItem';
import InventoryBoardItemSkeleton from '~/components/mypage/inventory/InventoryBoardItemSkeleton';

const {
  mapState: gameskinState,
  mapActions: gameskinActions,
} = createNamespacedHelpers('mypage/inventory/gameskin');

const {
  mapState: changeState,
  mapActions: changeActions,
} = createNamespacedHelpers('mypage/inventory/gameskin/change');

export default {
  components: {
    ButtonTabs,
    InventoryBoardContainer,
    InventoryBoardItem,
    InventoryBoardItemSkeleton,
  },
  data() {
    return {
      status: null,
      term: 0,
      startAt: new Date(),
      endAt: new Date(),
      page: 1,
      currentPage: 1,
      labelTabs: [
        // { label: '전체', value: '20' },
        { text: '소비 아이템', value: '2010' },
        { text: '기간제 아이템', value: '2020' },
      ],
      inputBoxValue: null,
      withdrawalPrice: 0,
    };
  },
  computed: {
    ...gameskinState({
      items: 'items',
      totalItems: 'totalItems',
      loading: 'loading',
    }),
    ...changeState({
      success: 'success',
      changeMessage: 'message',
    }),
  },
  watch: {
    currentPage(v) {
      console.log('currentPage:', v);
      this.load();
    },
    status(v) {
      this.currentPage = 1;
      this.load();
    },
    changeMessage(v) {
      if (v === null) {
        return;
      }
      this.showSingleButtonModal({
        message: v.replace(/(?:\\r\\n|\\r|\\n)/g, '<br />'),
        onConfirm: () => {
          // if (!this.success) {
          //   return;
          // }
          this.$auth.fetchUser();
          this.load();
        },
      });
    },
  },
  beforeMount() {
    if (this.$route.query.status) this.status = this.$route.query.status;
    else this.status = this.labelTabs[0].value;
  },
  beforeDestroy() {
    this.clear();
    this.changeClear();
  },
  methods: {
    ...gameskinActions({
      getBoards: 'getBoards',
      clear: 'clear',
    }),
    ...changeActions({
      changeNicknames: 'changeNicknames',
      useItems: 'useItems',
      changeClear: 'clear',
      withdrawal: 'withdrawal',
    }),
    load() {
      const { status, currentPage } = this;
      this.getBoards({
        status,
        page: currentPage,
        listRow: 12,
      });
    },
    onUse(v) {
      if (v.itemUseType === 'random_memo') {
        this.openRandomMessagesPopup();
        return;
      }
      if (v.itemUseType === 'nickname') {
        this.showDoubleButtonsModal({
          message: '아이템을 사용하여 닉네임을 변경하시겠습니까?',
          description: null,
          accent: '보유개수 ' + v.ctQty + '개',
          buttonConfirmText: '변경',
          onConfirm: () => {
            this.showNicknameModal(v);
          },
        });
        return;
      }
      if (v.itemUseType === 'use') {
        this.showDoubleButtonsModal({
          message: '선택하신 아이템을 사용 하시겠습니까?',
          buttonConfirmText: '사용',
          description: null,
          accent: null,
          onConfirm: () => {
            console.log(v.itNo, v.caId);
            this.useItems({
              itno: v.itNo,
              caid: v.caId,
            });
          },
        });
        return;
      }
      console.log(v);
    },
    showNicknameModal(v) {
      this.showNicknameMessageModal({
        accent: null,
        itNo: v.itNo,
        caId: v.caId,
        onConfirm: (itNo, caId, inputBoxValue, callback) => {
          this.changeNicknames({
            itno: itNo,
            caid: caId,
            mbnick: inputBoxValue,
            callback,
          });
        },
      });
    },
    onWithdrawal(v) {
      console.log('onWithdrawal:', v.itNo, v.ctQty, v.caId, v.itName);
      if (v.caId === '201030') {
        this.withdrawalPrice = 30000;
      } else if (v.caId === '201040') {
        this.withdrawalPrice = 50000;
      } else if (v.caId === '201050') {
        this.withdrawalPrice = 100000;
      } else if (v.caId === '202090') {
        this.withdrawalPrice = 3000;
      }
      // const itemPrice = this.withdrawalPrice * v.ctQty;

      this.showWithdrawalModal({
        itName: v.itName,
        itCnt: v.ctQty,
        itemPrice: this.withdrawalPrice,
        onConfirm: async (r) => {
          await this.withdrawal({
            itno: v.itNo,
            itcnt: r.mField,
          });
        },
      });
    },
  },
};
</script>
<style scoped>
.button-tabs {
  margin-bottom: 20px;
}

div.search-container {
  margin-bottom: 10px;
}
div.pagination-container {
  margin-top: 5px;
  text-align: center;
  margin-bottom: 20px;
}
</style>
