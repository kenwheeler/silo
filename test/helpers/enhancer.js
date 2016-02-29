export default (createStore) => (mutations, effects) => {
  return createStore(mutations, effects, { newState: true });
};
