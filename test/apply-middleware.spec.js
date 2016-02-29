import expect from "expect";
import { applyMiddleware } from "../src/index";
import middleware from "./helpers/middleware";

describe("applyMiddleware", () => {

  it("exists", () => {
    expect(applyMiddleware).toExist();
  });

  it("exposes dispatch and getState", () => {
    const noop = () => {};

    const createStore = applyMiddleware(middleware)(() => {
      return {
        dispatch: noop,
        getState: noop
      };
    });

    const store = createStore();

    expect(store.dispatch).toExist();
    expect(store.getState).toExist();

  });

});
