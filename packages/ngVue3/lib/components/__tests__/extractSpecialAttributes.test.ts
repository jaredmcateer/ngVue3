import { extractSpecialAttributes } from "../extractSpecialAttributes";
import { getNgAttributeObj } from "./__fixtures__/ngAttributes";

test("should extract special HTML attrs", () => {
  expect(extractSpecialAttributes(getNgAttributeObj())).toEqual({
    class: "my-class",
    style: "font-size:3;",
  });
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

  expect(extractSpecialAttributes(ngAttrObj)).toEqual({
    class: "",
    style: "",
  });
});
