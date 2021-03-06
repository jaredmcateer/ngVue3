import { lowerFirst } from "../lowerFirst";

test("should lower first character", () => {
  expect(lowerFirst("ASDF")).toEqual("aSDF");
});

test("should gracefully handle unicode", () => {
  expect(lowerFirst("πΆπ²ππΌπ²π")).toEqual("πΆπ²ππΌπ²π");
});

test("should throw with invalid type", () => {
  // @ts-expect-error Testing for a throw
  expect(() => lowerFirst(1)).toThrowError();
});
