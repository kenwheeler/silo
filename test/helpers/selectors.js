export const todoSelector = (state) =>
  state.todos
    .select((todo) => ({
      name: todo.name
    }));
