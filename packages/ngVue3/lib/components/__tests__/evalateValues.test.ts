import angular from "angular";
import "angular-mocks";
import { ExpressionsMap } from "../getExpressions";
import { evaluateValues } from "../evaluateValues";

interface TestScope extends ng.IScope {
  address?: Record<string, string>;
  name?: string;
  disabled?: boolean;
}

describe("Evaluating expressions maps", () => {
  let scope: TestScope;
  let expressionsMap: ExpressionsMap;

  beforeEach(() => {
    let $rootScope: ng.IRootScopeService;
    angular.mock.module("ngVue");

    angular.mock.inject((_$rootScope_: ng.IRootScopeService) => {
      $rootScope = _$rootScope_;

      scope = $rootScope.$new();

      scope.address = { street: "123 fake st", city: "Anytown" };
      scope.name = "Barb Ara";
      scope.disabled = false;
    });
  });

  it("should return empty object if expression map is also empty", () => {
    expressionsMap = {};
    expect(evaluateValues(expressionsMap, scope)).toEqual({});
  });

  it("should evaluate values of an expression map", () => {
    expressionsMap = {
      __ngvue_props__: "{address: address, user: name}",
      isDisabled: "disabled",
    };

    expect(evaluateValues(expressionsMap, scope)).toEqual({
      address: { street: "123 fake st", city: "Anytown" },
      user: "Barb Ara",
      isDisabled: false,
    });
  });
});
