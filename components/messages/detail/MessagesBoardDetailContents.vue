<template>
  <div class="view-container message-board detail contents">
    <table>
      <colgroup>
        <col width="100px" />
        <col width="" />
      </colgroup>
      <tbody>
        <tr>
          <th>{{ path == 'send' ? '받는' : '보낸' }} 사람</th>
          <td>
            <template v-if="loading">
              <b-skeleton width="100px"></b-skeleton>
            </template>
            <template v-else>
              <p :class="isAdmin ? 'admin' : ''">
                <i v-if="isAdmin" class="icon-svg admin"></i>
                {{ getName }}
              </p>
            </template>
          </td>
        </tr>
        <tr>
          <th>{{ path == 'send' ? '보낸' : '받은' }} 시간</th>
          <td>
            <template v-if="loading">
              <b-skeleton :width="`${getWidth(Math.random())}px`"></b-skeleton>
            </template>
            <template v-else>
              <p>
                {{ meSendDatetime }}
              </p>
            </template>
          </td>
        </tr>
        <tr>
          <th>읽은 시간</th>
          <td>
            <template v-if="loading">
              <b-skeleton :width="`${getWidth(Math.random())}px`"></b-skeleton>
            </template>
            <template v-else>
              <p>
                {{
                  meReadDatetime !== '0000-00-00 00:00:00'
                    ? meReadDatetime
                    : '읽지않음'
                }}
              </p>
            </template>
          </td>
        </tr>
        <tr>
          <th>내용</th>
          <td class="content">
            <template v-if="loading">
              <div class="html-contents">
                <b-skeleton
                  :width="`${getWidth(Math.random())}px`"
                  style="margin-bottom: 5px"
                ></b-skeleton>
                <b-skeleton
                  :width="`${getWidth(Math.random())}px`"
                  style="margin-bottom: 5px"
                ></b-skeleton>
                <b-skeleton
                  :width="`${getWidth(Math.random())}px`"
                  style="margin-bottom: 5px"
                ></b-skeleton>
                <b-skeleton
                  :width="`${getWidth(Math.random())}px`"
                  style="margin-bottom: 5px"
                ></b-skeleton>
                <b-skeleton
                  :width="`${getWidth(Math.random())}px`"
                  style="margin-bottom: 5px"
                ></b-skeleton>
              </div>
            </template>
            <template v-else>
              <div class="html-contents" v-html="parseMessage"></div>
            </template>
            <!-- <b-skeleton-img v-if="loading" aspect="5:1"></b-skeleton-img> -->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    loading: { type: Boolean, default: false },
    path: { type: String, default: null },
    senderId: { type: String, default: 'sender id' },
    senderNickname: { type: String, default: null },
    receiverId: { type: String, default: 'receiver id' },
    receiverNickname: { type: String, default: null },
    message: { type: String, default: null },
    meSendDatetime: { type: String, default: null },
    meReadDatetime: { type: String, default: null },
  },
  computed: {
    parseMessage() {
      return this.message.split('\n').join('<br />');
    },
    isAdmin() {
      const { path, senderId, receiverId } = this;
      if (path === 'send') {
        return receiverId === 'game_admin' || receiverId === 'sysadmin';
      } else {
        return senderId === 'game_admin' || senderId === 'sysadmin';
      }
    },
    getName() {
      const {
        path,
        senderId,
        senderNickname,
        receiverId,
        receiverNickname,
        isAdmin,
      } = this;

      if (path === 'send') {
        return receiverNickname !== null && receiverNickname.length > 0
          ? receiverNickname
          : receiverId;
      }
      if (isAdmin) {
        return '스포라이브';
      }
      return senderNickname !== null && senderNickname.length > 0
        ? senderNickname
        : senderId;
    },
  },
  methods: {
    getWidth(random) {
      return 300 * random + 100;
    },
  },
};
</script>

<style scoped>
* {
  margin: 0px;
  padding: 0px;
}
.view-container {
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
  padding: 10px 20px;
}

table tbody tr td.content {
  height: 305px;
}

table tbody tr td p {
  height: 1rem;
}
table tbody tr td .html-contents {
  height: 280px;
  line-height: 20px;
  word-break: break-all;
  overflow-y: scroll;
}

div.detail.contents {
  min-height: 320px;
}

.b-aspect,
.b-skeleton {
  /* margin-bottom: 10px; */
  height: 1rem;
}

.detail-buttons {
  margin-bottom: 20px;
}

.detail-buttons > *:not(:last-child) {
  margin-right: 5px;
}

.detail-buttons > button {
  width: 95px;
  height: 35px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 10px;
  transition: all 0.3s;
}

.detail-buttons > button.move {
  color: white;
  border: 1px solid #3eb2c0;
  background-color: #3eb2c0;
}

.detail-buttons > button.move:hover {
  color: #3eb2c0;
  background-color: #d8f0f2;
}

.detail-buttons > button.write {
  width: 110px;
  color: #3eb2c0;
  border: 1px solid #3eb2c0;
  background-color: #d8f0f2;
}

.detail-buttons > button.write:hover {
  color: white;
  border: 1px solid #3eb2c0;
  background-color: #3eb2c0;
}

.detail-buttons > button.write:focus,
.detail-buttons > button.write:active {
  outline: unset;
  border: 1px solid #3eb2c0;
}

p.admin {
  color: #3eb2c0;
  font-weight: 800;
}

.icon-svg.admin {
  width: 14px;
  height: 14px;
  vertical-align: text-top;
  margin-right: 5px;
}
</style>
