/* eslint-disable no-console */

import "babel-polyfill";

const effects = {
  GET_TODO: async function (dispatch, payload) {
    try {
      const todo = await new Promise((resolve) => {
        resolve({
          name: payload.name
        });
      });
      dispatch("ADD_TODO", todo);
    } catch (e) {
      console.error(e);
    }
  }
};

export default effects;

