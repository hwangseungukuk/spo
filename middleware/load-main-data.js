export const EXCLUDE_LIST = ['chat', 'safebox', 'messages', 'popup'];

export default async function ({ store, route }) {
  const exclude = EXCLUDE_LIST.some((ex) => route.name.includes(ex));
  console.log('exclude', exclude);
  if (exclude) {
    return;
  }

  if (route.name === 'index') {
    await store.dispatch('main/getMainData');
    return;
  }
  if (store.state.main.success) {
    return;
  }
  await store.dispatch('main/getMainData');
}
