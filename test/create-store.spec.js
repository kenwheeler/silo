import expect from "expect";
import { createStore } from "../src/index";
import mutations from "./helpers/mutations";
import effects from "./helpers/effects";
import enhancer from "./helpers/enhancer";
import nextMutations from "./helpers/next-mutations";
import nextEffects from "./helpers/next-effects";

describe("createStore", () => {

  it("exists", () => {
    expect(createStore).toExist();
  });

  it("exposes the public API", () => {
    const store = createStore(mutations, effects);
    const methods = Object.keys(store);

    expect(methods.length).toBe(7);
    expect(methods).toContain("dispatch");
    expect(methods).toContain("getState");
    expect(methods).toContain("replaceMutations");
    expect(methods).toContain("replaceEffects");
    expect(methods).toContain("stream");
    expect(methods).toContain("subscribe");
    expect(methods).toContain("actions");

  });

  it("sets an initialState when provided", () => {
    const store = createStore(mutations, effects, { test: true });
    const state = store.getState();
    expect(state).toEqual({ test: true, todos: [] });
  });

  it("responds to mutation dispatches", () => {
    const store = createStore(mutations, effects);
    store.dispatch("addTodo", { name: "Mutation" });
    const state = store.getState();
    expect(state.todos[0]).toEqual({ name: "Mutation" });
  });

  it("responds to action dispatch", () => {
    const store = createStore(mutations, effects);
    store.actions.addTodo({ name: "Mutation" });
    const state = store.getState();
    expect(state.todos[0]).toEqual({ name: "Mutation" });
  });

  it("throws if an invalid operation is supplied", () => {
    const store = createStore(mutations, effects);
    expect(() => {
      store.dispatch("notFound", { name: "Mutation" });
    }).toThrow();
  });

  it("responds to effect dispatches", (done) => {
    const store = createStore(mutations, effects);
    store.dispatch("getTodo", { name: "Effect" })
      .then(() => {
        const state = store.getState();
        expect(state.todos[0]).toEqual({ name: "Effect" });
        done();
      });
  });

  it("allows you to subscribe to changes", () => {
    const store = createStore(mutations, effects, { todos: [] });
    let todos = [];
    store.subscribe((state) => {
      todos = state.todos;
    });
    store.dispatch("addTodo", { name: "Test" });
    expect(todos).toEqual([{ name: "Test" }]);
  });

  it("changes state from enhancer", () => {
    const store = createStore(mutations, effects, { test: true }, enhancer);
    const state = store.getState();
    expect(state).toEqual({ newState: true, todos: [] });
  });

  it("replaces mutations", () => {
    const store = createStore(mutations, effects, { test: true });
    store.replaceMutations(nextMutations);
    store.actions.addPost({ name: "First post"});
    const state = store.getState();
    expect(state).toEqual({
      posts: [{ name: "First post"}],
      todos: [],
      test: true
    });
  });

  it("replaces effects", () => {
    const store = createStore(mutations, effects, { test: true });
    store.replaceEffects(nextEffects);
    store.actions.getTodos({ name: "Effect" })
    .then((done) => {
      const state = store.getState();
      expect(state.todos[0]).toEqual({ name: "Effect" });
      done();
    });
  });

});
