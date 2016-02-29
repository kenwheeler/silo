import expect from "expect";
import { mergeMutations } from "../src/index";
import mutations from "./helpers/mutations";
import nextMutations from "./helpers/next-mutations";

describe("mergeMutations", () => {

  it("exists", () => {
    expect(mergeMutations).toExist();
  });

  it("merges mutations initialStates", () => {
    const merged = mergeMutations(
      mutations,
      nextMutations
    );

    expect(merged.initialState).toEqual({
      todos: [],
      posts: []
    });

  });

  it("merges mutations operations", () => {
    const merged = mergeMutations(
      mutations,
      nextMutations
    );

    expect(merged.ADD_TODO).toExist();
    expect(merged.ADD_POST).toExist();
  });

});
