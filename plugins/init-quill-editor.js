import Quill from 'quill';

const Font = Quill.import('attributors/class/font');
Font.whitelist = [
  'NanumBarunGothic',
  'Gulim',
  'GulimChe',
  'Dotum',
  'DotumChe',
  'Batang',
  'BatangChe',
  'GungSeo',
  'NotoSans',
  'Arial',
  'Tahoma',
  'TNR',
  'Verdana',
  'CourierNew',
];
Quill.register(Font, true);

const Size = Quill.import('attributors/style/size');
Size.whitelist = [
  '8pt',
  '9pt',
  '10pt',
  '11pt',
  '12pt',
  '14pt',
  '18pt',
  '24pt',
  '32pt',
];
Quill.register(Size, true);

export default ({ app }, inject) => {
  inject('Quill', Quill);
};
