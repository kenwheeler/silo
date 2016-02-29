/* @flow */
/* eslint-disable max-params */

import Rx from "rxjs/Rx";

const createStore = function createStore(mutations: Object, effects: Object, initialState: any, enhancer: Function): Object {

  if (typeof enhancer !== "undefined") {
    return enhancer(createStore)(mutations, effects, initialState);
  }

  const subject = new Rx.Subject();

  let currentMutations = mutations;
  let currentEffects = effects;

  let currentState = {
    ...mutations.initialState,
    ...initialState
  };

  const dispatch = function dispatch(operation: string, payload: any): any {
    return operation in currentEffects
      ? currentEffects[operation].call(null, dispatch, payload)
      : subject.next({ operation, payload });
  };

  const invoke = Proxy.create({
    get: (proxy, name) => value => dispatch(name, value)
  });

  const stream = subject.scan(
    (state, { operation, payload }) => {
      if (operation in currentMutations) {
        return currentMutations[operation].call(null, state, payload);
      } else {
        throw new Error(`Operation "${operation}" not found in declared mutations or effects.`);
      }
    },
    currentState || {}
  ).share();

  const subscribe = stream.subscribe.bind(stream);

  subscribe((s: Object) => {
    currentState = s;
  });

  const getState = function getState(): Object {
    return currentState;
  };

  const replaceMutations = function replaceMutations(nextMutations: Object) {
    currentMutations = nextMutations;
    currentState = {
      ...currentMutations.initialState,
      ...currentState
    };
  };

  const replaceEffects = function replaceEffects(nextEffects: Object) {
    currentEffects = nextEffects;
  };

  return {
    dispatch,
    invoke,
    getState,
    replaceEffects,
    replaceMutations,
    stream,
    subscribe
  };

};

export default createStore;
