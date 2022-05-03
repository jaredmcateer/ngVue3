import angular from "angular";
import { nextTick, reactive } from "vue";
import { extractSpecialAttributes } from "../extractSpecialAttributes";
import { ExpressionsMap } from "../getExpressions";
import { watchSpecialAttributes } from "../watchSpecialAttributes";
import { getNgAttributeObj } from "./__fixtures__/ngAttributes";

interface TestScope extends ng.IScope {
  className: string;
  inlineStyle: string;
}

describe("watchExpression", () => {
  let expressionMap: ExpressionsMap;
  let scope: TestScope;
  let ngAttrObj: ng.IAttributes;
  let element: JQLite;
  let compile: ng.ICompileService;

  beforeEach(() => angular.mock.module("ngVue"));
  beforeEach(
    angular.mock.inject((_$rootScope_: ng.IRootScopeService, _$compile_: ng.ICompileService) => {
      compile = _$compile_;

      function extendScope(s: Partial<TestScope>): TestScope {
        s.className = "";
        s.inlineStyle = "";
        return s as TestScope;
      }

      scope = extendScope(_$rootScope_.$new());

      const el = angular.element('<div ng-class="className" ng-style="inlineStyle"></div>');
      element = compile(el)(scope);
      scope.$digest();
      // element = el;
    })
  );

  it("should setup watcher for ng-class/style", () => {
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
    const state = Object.assign(reactive({}), extractSpecialAttributes(ngAttrObj));

    expect(state.class).toEqual("");
    expect(state.style).toEqual("");

    scope.$digest();

    watchSpecialAttributes(state, element, scope);

    scope.className = "foo";
    scope.inlineStyle = "bar";

    scope.$digest();
    // TODO This is buggy behaviour that existed in previous version
    scope.$digest();

    expect(state.class).toEqual("ng-scope foo");
    // TODO Seems this is broken in previous versions as well
    expect(state.style).toEqual(undefined);
  });
});
