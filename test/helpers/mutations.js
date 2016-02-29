const mutations = {
  initialState: {
    todos: []
  },
  ADD_TODO: (state, payload) => ({
    ...state,
    todos: [
      ...state.todos,
      payload
    ]
  })
};

export default mutations;
