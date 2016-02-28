/* eslint-disable generator-star-spacing, no-console */

import "babel-polyfill";

const effects = {
  getTodo: async function getTodo(dispatch, payload) {
    try {
      const todo = await new Promise((resolve) => {
        resolve({
          name: payload.name
        });
      });
      dispatch("addTodo", todo);
    } catch (e) {
      console.error(e);
    }
  }
};

export default effects;

