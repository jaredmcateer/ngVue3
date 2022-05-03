import { lowerFirst } from "../lowerFirst";

test("should lower first character", () => {
  expect(lowerFirst("ASDF")).toEqual("aSDF");
});

test("should gracefully handle unicode", () => {
  expect(lowerFirst("𐐶𐐲𐑌𐐼𐐲𐑉")).toEqual("𐐶𐐲𐑌𐐼𐐲𐑉");
});

test("should throw with invalid type", () => {
  // @ts-expect-error Testing for a throw
  expect(() => lowerFirst(1)).toThrowError();
});
