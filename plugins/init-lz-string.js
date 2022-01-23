import LZString from 'lz-string';

export default ({ app }, inject) => {
  inject('LZString', LZString);
};
