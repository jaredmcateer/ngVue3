import { extractHtmlAttributes } from "../extractHtmlAttributes";
import { ngAttributeObj } from "./__fixtures__/ngAttributes";

test("should filter special attributes and return what is left", () => {
  expect(extractHtmlAttributes(ngAttributeObj)).toEqual([
    "foo",
    "class",
    "disabled",
    "style",
    "tabindex",
    "vDataBar",
  ]);
});
