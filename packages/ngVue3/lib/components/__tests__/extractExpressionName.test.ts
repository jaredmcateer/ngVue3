import { extractExpressionName } from "../extractExpressionName";

test("should convert ngVue prop attribute to Vue attribute", () => {
  expect(extractExpressionName("vPropsMyProp", "vProps")).toEqual("myProp");
});

test("should convert ngVue event attribute to Vue attribute", () => {
  expect(extractExpressionName("vOnMyEvent", "vOn")).toEqual("onMyEvent");
});

test("should not convert attribute with keywords but not as prefix", () => {
  expect(extractExpressionName("myvPropsFoo", "vProps")).toEqual(null);
  expect(extractExpressionName("myvOnEvent", "vProps")).toEqual(null);
});
