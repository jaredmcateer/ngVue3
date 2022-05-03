import { extractHtmlAttributes } from "../extractHtmlAttributes";
import { getNgAttributeObj } from "./__fixtures__/ngAttributes";

test("should filter special attributes and return what is left", () => {
  expect(extractHtmlAttributes(getNgAttributeObj())).toEqual([
    "foo",
    "disabled",
    "tabindex",
    "vDataBar",
  ]);
});
