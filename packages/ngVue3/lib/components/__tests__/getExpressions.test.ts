import { test, expect } from "vitest";
import { extractExpressions } from "../getExpressions";
import { ngAttributeObj } from "./fixtures/ngAttributes";

test("should get the props", () => {
  expect(extractExpressions("props", ngAttributeObj)).toEqual({
    __ngvue_props__: "{person: ctrl.person, people: ctrl.people}",
    foo: "ctrl.foo",
    isDisabled: "ctrl.disabled",
  });
});

test("should get the event handlers", () => {
  expect(extractExpressions("on", ngAttributeObj)).toEqual({
    onFooBar: "ctrl.bar",
    onHandleClick: "ctrl.handleClick.bind(ctrl, 'foo')",
  });
});

test("should get the HTML attributes and fill out empty", () => {
  expect(extractExpressions("attrs", ngAttributeObj)).toEqual({
    class: "my-class",
    "data-foo": "ctrl.foo",
    disabled: "disabled", // an empty attribute
    style: "font-size:3;",
    tabindex: "3",
    "v-data-bar": "ctrl.data",
  });
});
