import "babel-polyfill";

const effects = {
  getTodo: async function getTodo(dispatch, payload) {
    try {
      const todo = await new Promise((resolve,reject) => {
        resolve({
          name: payload.name
        });
      });
      dispatch("addTodo", todo);
    } catch (e) {
      console.log(e);
    }
  }
};

export default effects;

