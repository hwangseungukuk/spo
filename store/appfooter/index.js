const state = () => ({
  menu: [
    {
      name: '회사소개',
      href: 'https://www.neowiz.com/neowiz',
    },
    {
      name: '이용약관/정책',
      href: 'http://www.pmang.com/pmang_policy.nwz?tab=1',
    },
    {
      name: '스포라이브 운영정책',
      href: 'https://www.spolive.com/bbs/content.php?co_id=Operational',
    },
    {
      name: '개인정보처리방침',
      href: 'https://www.spolive.com/bbs/content.php?co_id=privacy',
      highlight: true,
    },
    {
      name: '청소년 보호정책',
      popup: {
        url: 'https://www.spolive.com/page/youthProtection.php',
        options:
          'top=150, left=150, width=660, height=700, status=no, menubar=no, toolbar=no, resizable=no',
        target: '_blank',
      },
    },
    {
      name: '고객센터',
      router: 'mypage-customer-faq',
    },
    {
      name: '게임이용해지',
      router: 'unregister',
    },
  ],
});

export default {
  namespaced: true,
  state,
};
