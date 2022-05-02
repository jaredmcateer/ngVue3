import { fail } from "assert";
import { expect, test, vi } from "vitest";
import { createVueComponent } from "../createVueComponent";

test("returns an array that matches angular directive signature", () => {
  const name = "component-name";
  const component = { setup() {} };
  const config = { restrict: "A" };
  const val = createVueComponent("name", component, config);

  expect(val).toHaveLength(2);
  expect(val[0]).toEqual("name");
  expect(Array.isArray(val[1])).toBeTruthy();
  expect(val[1][0]).toEqual("createVueComponent");
  expect(val[1][1]).toBeTypeOf("function");

  const fn = vi.fn();

  if (typeof val[1][1] !== "function") fail("Should be a function");
  val[1][1](fn);

  expect(fn).toBeCalledWith("name", component, config);
});
