export default (currentEffects, currentMutations, dispatch, actions) => {
  if (typeof Proxy === "undefined") {
    for (const operation in currentEffects) {
      actions[operation] = (payload: any) => dispatch(operation, payload);
    }
    for (const operation in currentMutations) {
      actions[operation] = (payload: any) => dispatch(operation, payload);
    }
  } else {
    actions = Proxy.create({
      get: (proxy, name: string) => (payload: any) => dispatch(name, payload)
    });
  }
};
