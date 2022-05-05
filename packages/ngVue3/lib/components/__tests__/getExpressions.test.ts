import { extractExpressions } from "../getExpressions";
import { getNgAttributeObj } from "./__fixtures__/ngAttributes";

let ngAttributeObj: ng.IAttributes;

let mockRemove: jest.Mock;

beforeEach(() => {
  ngAttributeObj = getNgAttributeObj();
  mockRemove = jest.fn();
});

test("should get the props", () => {
  expect(extractExpressions("props", ngAttributeObj, mockRemove)).toEqual({
    __ngvue_props__: "{person: ctrl.person, people: ctrl.people}",
    foo: "ctrl.foo",
    isDisabled: "ctrl.disabled",
  });

  expect(mockRemove).toBeCalledTimes(3);
  expect(mockRemove.mock.calls).toEqual([["vProps"], ["vPropsFoo"], ["vPropsIsDisabled"]]);
});

test("should get the event handlers", () => {
  expect(extractExpressions("on", ngAttributeObj, mockRemove)).toEqual({
    onFooBar: "ctrl.bar",
    onHandleClick: "ctrl.handleClick.bind(ctrl, 'foo')",
  });
  expect(mockRemove).toBeCalledTimes(2);
  expect(mockRemove.mock.calls).toEqual([["vOnFooBar"], ["vOnHandleClick"]]);
});

test("should get the HTML attributes and fill out empty ones", () => {
  expect(extractExpressions("attrs", ngAttributeObj, mockRemove)).toEqual({
    "data-foo": "ctrl.foo",
    disabled: "disabled", // an empty attribute
    tabindex: "3",
    "v-data-bar": "ctrl.data",
  });
  expect(mockRemove).toBeCalledTimes(4);
  expect(mockRemove.mock.calls).toEqual([["foo"], ["disabled"], ["tabindex"], ["vDataBar"]]);
});
