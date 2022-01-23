export const EXCLUDE_LIST = ['chat', 'safebox', 'messages'];

export default async function ({ store, route }) {
  const exclude = EXCLUDE_LIST.some((ex) => route.name.includes(ex));
  console.log('exclude', exclude);
  if (exclude) {
    return;
  }
  const hasTeamData = store.state.mapper.info.success;
  if (hasTeamData) {
    return;
  }
  await store.dispatch('mapper/info/getInfo');
}
