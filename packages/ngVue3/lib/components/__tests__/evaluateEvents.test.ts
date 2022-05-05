import angular from "angular";
import "angular-mocks";
import { ExpressionsMap } from "../getExpressions";
import { evaluateEvents } from "../evaluateEvents";
import { useNgVue } from "../../main";

interface TestScope extends ng.IScope {
  handleClick?: Function;
  oops?: string;
}

describe("Evaluating expressions maps", () => {
  let scope: TestScope;
  let expressionsMap: ExpressionsMap;

  beforeEach(() => {
    let $rootScope: ng.IRootScopeService;
    angular.mock.module(useNgVue());

    angular.mock.inject((_$rootScope_: ng.IRootScopeService) => {
      $rootScope = _$rootScope_;

      scope = $rootScope.$new();
      scope.handleClick = jest.fn();
      scope.oops = "foo";
    });
  });

  it("should return empty object if expression map is also empty", () => {
    expressionsMap = {};
    expect(evaluateEvents(expressionsMap, scope)).toEqual({});
  });

  it("should return a value if it's not a function", () => {
    expressionsMap = { onMyClick: "oops" };
    const values = evaluateEvents(expressionsMap, scope);

    expect(console.warn).toBeCalledWith(
      `[ngVue] Bound a non-function as an event handler (onMyClick)`
    );
    expect(values).toEqual({ onMyClick: expect.any(String) });

    expect(() => {
      values.onMyClick("test");
      scope.$digest();
    }).toThrowError("values.onMyClick is not a function");
  });

  it("should evaluate events of an expression map", () => {
    expressionsMap = { onMyClick: "handleClick" };
    const values = evaluateEvents(expressionsMap, scope);

    expect(values).toEqual({ onMyClick: expect.any(Function) });

    values.onMyClick("test");
    scope.$digest();

    expect(scope.handleClick).toBeCalledWith("test");
  });
});
