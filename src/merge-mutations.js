/* @flow */

const mergeMutations = function (...mutations: Array<Object>): Object {
  let combinedState = {};
  let combinedOperations = {};

  for (let i = 0; i < mutations.length; i++) {
    const { initialState, ...operations } = mutations[i];

    combinedState = {
      ...combinedState,
      ...initialState
    };

    combinedOperations = {
      ...combinedOperations,
      ...operations
    };
  }

  return {
    initialState: combinedState,
    ...combinedOperations
  };

};

export default mergeMutations;
