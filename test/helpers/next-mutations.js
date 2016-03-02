const mutations = {
  initialState: {
    posts: []
  },
  addPost: (state, payload) => ({
    ...state,
    posts: [
      ...state.posts,
      payload
    ]
  })
};

export default mutations;
