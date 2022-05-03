import { extractExpressions } from "../getExpressions";
import { getNgAttributeObj } from "./__fixtures__/ngAttributes";

let ngAttributeObj: ng.IAttributes;

beforeEach(() => {
  ngAttributeObj = getNgAttributeObj();
});

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

test("should get the HTML attributes and fill out empty ones", () => {
  expect(extractExpressions("attrs", ngAttributeObj)).toEqual({
    "data-foo": "ctrl.foo",
    disabled: "disabled", // an empty attribute
    tabindex: "3",
    "v-data-bar": "ctrl.data",
  });
});
