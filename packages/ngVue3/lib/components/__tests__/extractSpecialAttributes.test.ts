import { extractSpecialAttributes } from "../extractSpecialAttributes";
import { getNgAttributeObj } from "./__fixtures__/ngAttributes";

let removeAttrMock: jest.Mock;
beforeEach(() => (removeAttrMock = jest.fn()));
test("should extract special HTML attrs", () => {
  expect(extractSpecialAttributes(getNgAttributeObj(), removeAttrMock)).toEqual({
    class: "my-class",
    style: "font-size:3;",
  });

  expect(removeAttrMock).toBeCalledTimes(2);
  expect(removeAttrMock.mock.calls).toEqual([["class"], ["style"]]);
});

test("should extract special angular bind attrs when HTML attrs are not present", () => {
  const ngAttrObj = getNgAttributeObj();
  delete ngAttrObj.class;
  delete ngAttrObj.style;
  const $attr = ngAttrObj.$attr as Record<string, string>;
  delete $attr.class;
  delete $attr.style;
  ngAttrObj.ngClass = "ctrl.myClass";
  ngAttrObj.ngStyle = "ctrl.myStyle";
  $attr.ngClass = "ng-class";
  $attr.ngStyle = "ng-style";

  expect(extractSpecialAttributes(ngAttrObj, removeAttrMock)).toEqual({
    class: "",
    style: "",
  });
  expect(removeAttrMock).toBeCalledTimes(2);
  expect(removeAttrMock.mock.calls).toEqual([["class"], ["style"]]);
});
