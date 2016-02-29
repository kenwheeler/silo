const mutations = {
  initialState: {
    posts: []
  },
  ADD_POST: (state, payload) => ({
    ...state,
    posts: [
      ...state.posts,
      payload
    ]
  })
};

export default mutations;
