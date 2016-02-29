import expect from "expect";
import { compose } from "../src/index";

describe("compose", () => {

  it("exists", () => {
    expect(compose).toExist();
  });

  it("returns the only arg if only one arg is specified", () => {
    const onlyFunc = compose();
    expect(onlyFunc(5)).toEqual(5);
  });

  it("facilitates rightward composition", () => {
    const first = (a) => a * 2;
    const second = (b) => b / 3;
    const third = (c) => c + 5;

    const testFunc = compose(
      first,
      second,
      third
    );

    expect(testFunc(4)).toEqual(6);

  });

});
