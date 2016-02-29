export default createStore => (mutations, effects, initialState) => {
  return createStore(mutations, effects, { newState: true })
}