import { getComponentName } from "../getComponentName";

test("should return name if property set", () => {
  expect(getComponentName({ name: "MyComponent" })).toEqual("MyComponent");
});

test("should return the name inferred from file path", () => {
  expect(getComponentName({ __file: "path/to/my-component.vue" })).toEqual("MyComponent");
});

test("should return a generic name if it cannot be inferred", () => {
  expect(getComponentName({})).toEqual("AnonymousComponent");
});

test("should prefer name to file path", () => {
  expect(getComponentName({ name: "MyComponent", __file: "path/to/not-my-component.vue" })).toEqual(
    "MyComponent"
  );
});
