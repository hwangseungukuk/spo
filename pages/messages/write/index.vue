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
            <th><label for="nickname">받는 사람</label></th>
            <td>
              <b-form-input
                id="nickname"
                v-model="ids"
                name="nickname"
                placeholder="받는 사람의 닉네임을 입력해 주세요."
              />
              <p class="msg">여러 회원에게 보낼 때는 컴마(,)로 구분하세요.</p>
            </td>
          </tr>
          <tr>
            <th><label for="context">내용</label></th>
            <td>
              <b-form-textarea
                id="context"
                v-model="memo"
                placeholder="내용을 입력해 주세요."
              ></b-form-textarea>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="footer">
        <b-btn type="submit" variant="info" class="send" @click="messageSend"
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
} = createNamespacedHelpers('user/messages/write');

const {
  mapState: messagesDetailState,
  mapActions: messagesDetailActions,
} = createNamespacedHelpers('user/messages/detail');

export default {
  data() {
    return {
      ids: null,
      memo: null,
    };
  },
  computed: {
    ...messagesWriteState({
      writeSuccess: 'success',
      writeMessage: 'message',
      writeError: 'error',
      writeRequesting: 'requesting',
    }),
    ...messagesDetailState({
      detailSuccess: 'success',
      detailMessage: 'message',
      detailError: 'error',
      detailData: 'data',
      detailLoading: 'loading',
    }),
  },
  watch: {
    detailMessage(v) {
      // 답변글 불러오기 팝업 알림
      if (v === null) {
        return;
      }
      this.showSingleButtonModal({
        message: v,
        description: null,
        onConfirm: () => {
          this.$router.push({
            name: 'messages-path',
            params: { path: 'recv' },
            query: { page: 1 },
          });
        },
      });
    },
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
  async mounted() {
    if (this.$route.query.me_id) {
      await this.getDetail({ id: this.$route.query.me_id, path: 'recv' });
      this.ids = this.detailData.me_send_mb_nick;
      this.memo = '\n\n>\n>\n> ' + this.detailData.me_memo + ' \n>>';
    }
    if (this.$route.query.t) {
      this.ids = this.$route.query.t;
    }
  },
  methods: {
    ...messagesWriteActions(['write']),
    async messageSend() {
      const { ids, memo } = this;
      if (!ids) {
        this.showSingleButtonModal({
          message: '받는 사람을 입력해 주세요.',
        });
      } else if (!memo) {
        this.showSingleButtonModal({
          message: '내용을 입력해 주세요.',
        });
      } else {
        await this.write({ ids, memo });
      }
    },
    ...messagesDetailActions(['getDetail', 'clear']),
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
  font-family: NanumBarunGothic, sans-serif;
}
textarea {
  padding: 10px;
  font-size: 12px;
  background: #f2f2f2;
  border: 1px solid #e6e6e6;
  border-radius: 0px;
  height: 310px;
  resize: none;
  font-family: NanumBarunGothic, sans-serif;
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
</style>
