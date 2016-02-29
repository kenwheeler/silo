const mutations = {
  initialState: {
    posts: []
  },
  addPost: (state, payload) => ({
    posts: [
      payload
    ]
  })
};

export default mutations;
