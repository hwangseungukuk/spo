<template>
  <div class="write-container">
    <b-form @submit.prevent="$emit('submit')">
      <table>
        <colgroup>
          <col width="100px" />
          <col width="" />
        </colgroup>
        <tbody>
          <tr>
            <td colspan="2">
              <div class="selectBuy">
                <div class="select">
                  <b-form-group style="text-align: center">
                    <b-form-radio
                      v-for="(option, index) in randomOptions"
                      :key="index"
                      v-model="selectCount"
                      name="randMemoIdx"
                      class="field"
                      :value="option.count"
                      :disabled="
                        randomMemoCount(option.ca_id) == 0 ? true : false
                      "
                    >
                      랜덤쪽지 {{ option.count }}개 보내기
                      <span>({{ randomMemoCount(option.ca_id) }}개)</span>
                    </b-form-radio>
                  </b-form-group>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <th><label for="context">내용</label></th>
            <td>
              <b-form-textarea
                id="context"
                ref="memoArea"
                v-model="memo"
                placeholder="내용을 입력해 주세요."
              ></b-form-textarea>
              <p class="notice">
                * 랜덤 쪽지는 최근 30일 이내 게임을 플레이한 유저들을 대상으로
                랜덤하게 발송 됩니다.
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="footer">
        <b-btn
          type="submit"
          variant="info"
          class="send"
          :disabled="sendState"
          @click="messageSend"
          >보내기</b-btn
        >
        <nuxt-link tag="a" class="btn btn-light list" :to="{ name: 'messages' }"
          >취소</nuxt-link
        >
      </div>
    </b-form>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const {
  mapState: messagesWriteState,
  mapActions: messagesWriteActions,
} = createNamespacedHelpers('user/messages/write/random');

const {
  mapState: gameskinState,
  mapActions: gameskinActions,
} = createNamespacedHelpers('mypage/inventory/gameskin');

export default {
  data() {
    return {
      selectCount: null,
      memo: null,
      randomOptions: [
        { count: 300, ca_id: '201030' },
        { count: 500, ca_id: '201040' },
        { count: 1000, ca_id: '201050' },
      ],
      sendState: false,
    };
  },
  computed: {
    ...messagesWriteState({
      writeSuccess: 'success',
      writeMessage: 'message',
      writeError: 'error',
      writeRequesting: 'requesting',
    }),
    ...gameskinState({
      items: 'items',
      totalItems: 'totalItems',
      loading: 'loading',
    }),
  },
  watch: {
    writeError(v) {
      // 글쓰기 오류 팝업 알림
      if (v === null) {
        return;
      }
      this.showSingleButtonModal({
        message: '쪽지를 발송 할 수 없습니다.',
        description: '오류가 발생하였습니다.',
      });
    },
    writeMessage(v) {
      // 글쓰기 팝업 알림
      if (v === null) {
        return;
      }
      this.showSingleButtonModal({
        message: v,
        description: null,
        onConfirm: this.writeSuccess
          ? () => {
              this.$router.push({
                name: 'messages-path',
                params: { path: 'send' },
                query: { page: 1 },
              });
            }
          : () => {},
      });
    },
  },
  mounted() {
    this.getBoards({ status: 20, page: 1 });
  },
  methods: {
    ...messagesWriteActions(['write']),
    ...gameskinActions({ getBoards: 'getBoards' }),
    async messageSend() {
      this.sendState = true;
      const { selectCount, memo } = this;
      // console.log(selectCount, memo);
      if (selectCount == null) {
        this.showSingleButtonModal({
          message: '아이템을 선택해 주세요.',
          onConfirm: () => {
            console.log('...');
          },
        });
        this.sendState = true;
      } else if (memo == null) {
        this.showSingleButtonModal({
          message: '내용을 입력해 주세요.',
          onConfirm: () => {
            this.$refs.memoArea.focus();
          },
        });
        this.sendState = true;
      } else {
        await this.write({ selectCount, memo });
      }
    },
    randomMemoCount(caId) {
      const result = this.items.find((item) => item.ca_id3 === caId);
      if (result) {
        return result.it_useCnt;
      } else {
        return 0;
      }
    },
  },
};
</script>

<style scoped>
* {
  margin: 0px;
  padding: 0px;
}
.write-container {
  min-width: 670px;
  margin-top: 20px;
  transform: skew(-0.03deg);
}
table {
  width: 100%;
  color: #888;
  margin-bottom: 20px;
  border-top: 1px solid #3eb2c0;
  border-bottom: 1px solid #3eb2c0;
}
table tbody tr {
  border-bottom: 1px solid #e6e6e6;
}
table tbody tr:last-child {
  border-bottom: 0px;
}
table tbody tr th {
  padding: 13px 20px 0px;
  background: #f2f2f2;
  font-weight: 700;
  vertical-align: top;
}
table tbody tr td {
  padding: 10px;
}

input {
  padding: 0 10px;
  font-size: 12px;
  background: #f2f2f2;
  border: 1px solid #e6e6e6;
  border-radius: 0px;
}
textarea {
  padding: 10px;
  font-size: 12px;
  background: #f2f2f2;
  border: 1px solid #e6e6e6;
  border-radius: 0px;
  height: 294px;
  resize: none;
}
textarea::placeholder {
  color: #df2f5d;
}
.msg {
  color: #3eb2c0;
  padding: 10px 10px 0;
}

.footer {
  text-align: center;
}

.footer > button,
.footer > a {
  width: 95px;
  height: 35px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 10px;
  transition: all 0.3s;
  margin: 0 3px;
}
.footer > a {
  line-height: 35px;
  color: #999;
  background: #e6e6e6;
}

.notice {
  color: #3eb2c0;
  font-weight: 700;
  padding: 12px 0 2px;
}
.selectBuy {
  padding: 10px 0;
}

.selectBuy .select fieldset > div {
  text-align: center;
}
.selectBuy .select fieldset > div > .field {
  padding-left: 34px;
}
.form-group >>> .bv-no-focus-ring {
  display: flex;
}

.selectBuy .select fieldset > div > .field {
  padding-left: 34px;
  display: inline-block;
  align-items: center;
  line-height: 23px;
  font-weight: 700;
  color: #444;
  flex: auto;
}
.selectBuy .select fieldset > div > .field span {
  font-weight: 400;
  color: #888;
}
.selectBuy .select fieldset > div > .field:nth-of-type(1) {
  padding-left: 24px;
}
</style>
