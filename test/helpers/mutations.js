const mutations = {
  initialState: {
    todos: []
  },
  addTodo: (state, payload) => ({
    ...state,
    todos: [
      ...state.todos,
      payload
    ]
  })
};

export default mutations;
