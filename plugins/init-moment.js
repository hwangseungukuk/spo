import moment from 'moment';
import 'moment/locale/ko';
moment.locale('ko');

export default ({ app }, inject) => {
  inject('moment', moment);
};
