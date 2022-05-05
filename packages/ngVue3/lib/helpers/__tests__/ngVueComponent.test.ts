import { ngVueComponent } from "../ngVueComponent";

test("returns an array that matches angular directive signature", () => {
  const name = "component-name";
  const component = { setup() {} };
  const config = { restrict: "A" };
  const val = ngVueComponent("name", component, config);

  expect(val).toHaveLength(2);
  expect(val[0]).toEqual("name");
  expect(Array.isArray(val[1])).toBeTruthy();
  expect(val[1][0]).toEqual("createVueComponent");
  expect(typeof val[1][1]).toEqual("function");

  const fn = jest.fn();

  if (typeof val[1][1] !== "function") fail("Should be a function");
  val[1][1](fn);

  expect(fn).toBeCalledWith(component, config);
});
