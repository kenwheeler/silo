import expect from "expect";
import { createStore } from "../src/index";
import mutations from "./helpers/mutations";
import effects from "./helpers/effects";
import enhancer from "./helpers/enhancer";
import nextMutations from './helpers/nextMutations'
import nextEffects from './helpers/nextEffects'

describe("createStore", () => {

  it("exists", () => {
    expect(createStore).toExist();
  });

  it("exposes the public API", () => {
    const store = createStore(mutations, effects);
    const methods = Object.keys(store);

    expect(methods.length).toBe(7);
    expect(methods).toContain("commit");
    expect(methods).toContain("getState");
    expect(methods).toContain("replaceMutations");
    expect(methods).toContain("replaceEffects");
    expect(methods).toContain("stream");
    expect(methods).toContain("subscribe");
    expect(methods).toContain("invoke");
  });

  it("sets an initialState when provided", () => {
    const store = createStore(mutations, effects, { test: true });
    const state = store.getState();
    expect(state).toEqual({ test: true, todos: [] });
  });

  it("responds to mutation commites", () => {
    const store = createStore(mutations, effects);
    store.commit("ADD_TODO", { name: "Mutation" });

    const state = store.getState();
    expect(state.todos[0]).toEqual({ name: "Mutation" });
  });

  it("throws if an invalid operation is supplied", () => {
    const store = createStore(mutations, effects);
    expect(() => {
      store.commit("NOT_FOUND", { name: "Mutation" });
    }).toThrow();
  });

  it("responds to effect commites", (done) => {
    const store = createStore(mutations, effects);
    store.commit("GET_TODO", { name: "Effect" })
      .then(() => {
        const state = store.getState();
        expect(state.todos[0]).toEqual({ name: "Effect" });
        done();
      });
  });

  it("invoke mutations via proxy", (done) => {
    const store = createStore(mutations, effects);
    store.invoke.GET_TODO({ name: "Effect" })
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
    store.commit("ADD_TODO", { name: "Test" });
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
    store.commit("ADD_POST", { name: 'first post'})
    const state = store.getState()
    expect(state).toEqual({ posts: [{ name: 'first post'}] });
  });

  it("replaces effects", () => {
    const store = createStore(mutations, effects, { test: true });
    store.replaceEffects(nextEffects);
    store.commit("GET_TODOS", { name: "Effect" })
    .then(() => {
      const state = store.getState();
      expect(state.todos[0]).toEqual({ name: "Effect" });
      done();
    });
  });

});
