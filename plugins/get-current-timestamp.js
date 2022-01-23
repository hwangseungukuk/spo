import Vue from 'vue';
const TimestampEvent = new Vue();
setInterval(() => {
  TimestampEvent.$emit('timestamp', new Date().getTime());
}, 1000);

export default ({ app }, inject) => {
  inject('timestamp', TimestampEvent);
};
