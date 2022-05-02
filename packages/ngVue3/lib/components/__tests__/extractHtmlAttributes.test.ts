import { test, expect } from "vitest";
import { extractHtmlAttributes } from "../extractHtmlAttributes";
import { ngAttributeObj } from "./fixtures/ngAttributes";

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
