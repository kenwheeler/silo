export default (currentEffects, currentMutations, dispatch, actions) => {
  for (const operation in currentEffects) {
    actions[operation] = (payload: any) => dispatch(operation, payload);
  }
  for (const operation in currentMutations) {
    actions[operation] = (payload: any) => dispatch(operation, payload);
  }
};
