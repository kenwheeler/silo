const middleware = (store) => (next) => (action) => {
  return {
    store,
    next,
    action
  };
};

export default middleware;
