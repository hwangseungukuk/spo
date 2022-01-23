import {
  CODE_NOT_PROVIDE_INFORMATION,
  CODE_NOT_FOUND_USER,
  CODE_NOT_LOGIN_PMANG,
} from '~/store/user/login/pmang';

export const EXCLUDE_LIST = ['chat', 'safebox', 'messages', 'register'];

export default async function ({ $axios, store, route, redirect }) {
  console.log(process.env.CONF_PMANG_LOGIN === 'true');
  console.log(process.env.PMANG_LOGIN);
  if (!process.env.PMANG_LOGIN) {
    return;
  }
  const exclude = EXCLUDE_LIST.some((ex) => route.name.includes(ex));
  console.log('exclude', exclude);
  if (exclude) {
    return;
  }
  if (store.state.user.login.pmang.success) {
    return;
  }
  try {
    await store.dispatch('user/login/pmang/loginCheck');

    console.log(store.state.user.login.pmang);
    const { code, success } = store.state.user.login.pmang;
    console.log(code);
    console.log(success);

    if (code === CODE_NOT_LOGIN_PMANG) {
      console.log('go to login page');
      try {
        window.location.href = '/api/views/member/pmang_login.php';
      } catch (e) {
        console.error(e);
      }
    }

    if (code === CODE_NOT_PROVIDE_INFORMATION) {
      window.location.href =
        '/api/views/member/pmang_agree.php?return_url=https://spolive.game.pmang.com/register';
    }

    if (code === CODE_NOT_FOUND_USER) {
      redirect({ name: 'register' });
    }
  } catch (e) {
    console.error(e);
  }
}
