const mutations = {
  initialState: {
    posts: []
  },
  ADD_POST: (state, payload) => ({
    posts: [
      payload
    ]
  })
};

export default mutations;
