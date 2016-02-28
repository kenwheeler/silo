import expect from "expect";
import { createStore } from "../src/index";
import mutations from "./helpers/mutations";
import effects from "./helpers/effects";

describe("createStore", () => {

  it("exists", () => {
    expect(createStore).toExist();
  });

  it("exposes the public API", () => {
    const store = createStore(mutations, effects);
    const methods = Object.keys(store);

    expect(methods.length).toBe(6);
    expect(methods).toContain("dispatch");
    expect(methods).toContain("getState");
    expect(methods).toContain("replaceMutations");
    expect(methods).toContain("replaceEffects");
    expect(methods).toContain("stream");
    expect(methods).toContain("subscribe");
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

  it("throws if an invalid operation is supplied", () => {
    const store = createStore(mutations, effects);
    expect(() => {
      store.dispatch("doesntExist", { name: "Mutation" });
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

});
