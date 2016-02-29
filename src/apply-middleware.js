/* @flow */
/* eslint-disable max-params */

import compose from "./compose";

const applyMiddleware = function (...middlewares: Array<Function>): Function {
  return (createStore) => (mutations, effects, initialState, enhancer) => {
    const store = createStore(mutations, effects, initialState, enhancer);
    let dispatch = store.dispatch;
    let chain = [];

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    };

    chain = middlewares.map((middleware) => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      dispatch
    };

  };

};

export default applyMiddleware;
