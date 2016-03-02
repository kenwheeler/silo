/* @flow */
/* eslint-disable max-params */

import Rx from "rxjs/Rx";
import bindActions from "./bind-actions";
/**
 * Creates a silo store
 *
 * @param {Object} mutations An object that contains mutation functions and an
 * inital state.
 *
 * @param {Object} effects An object that contains effect functions.
 *
 * @param {Object} initialState The initial state.
 *
 * @param {Function} enhancer The store enhancer.
 *
 * @returns {Store} A silo store
 */

const canProxy = typeof Proxy !== "undefined";

const createStore = function (mutations: Object, effects: Object, initialState: any, enhancer: Function): Object {

  if (typeof enhancer !== "undefined") {
    return enhancer(createStore)(mutations, effects, initialState);
  }

  const subject = new Rx.Subject();

  let actions = {};
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

  if (canProxy) {
    actions = Proxy.create({
      get: (proxy, name: string) => (payload: any) => dispatch(name, payload)
    });
  } else {
    bindActions(currentEffects, currentMutations, dispatch, actions);
  }

  const stream = subject.scan(
    (state, { operation, payload }) => {
      if (operation in currentMutations) {
        return currentMutations[operation].call(null, state, payload);
      } else if (operation === "internal/BOOTSTRAP") {
        return payload;
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
    if (!canProxy) bindActions(currentEffects, nextMutations, dispatch, actions);
    currentState = {
      ...currentMutations.initialState,
      ...currentState
    };

    dispatch("internal/BOOTSTRAP", currentState);
  };

  const replaceEffects = function replaceEffects(nextEffects: Object) {
    currentEffects = nextEffects;
    if (!canProxy) bindActions(nextEffects, currentMutations, dispatch, actions);
  };

  return {
    dispatch,
    actions,
    getState,
    replaceEffects,
    replaceMutations,
    stream,
    subscribe
  };

};

export default createStore;
