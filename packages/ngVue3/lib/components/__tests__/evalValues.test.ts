import angular from "angular";
import "angular-mocks";
import { ExpressionsMap } from "../getExpressions";
import { evaluateValues } from "../evalValues";

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

      expressionsMap = {
        __ngvue_props__: "{address: address, user: name}",
        isDisabled: "disabled",
      };
    });
  });

  it("should evaluate values of an expression map", () => {
    expect(evaluateValues(expressionsMap, scope)).toEqual({
      address: { street: "123 fake st", city: "Anytown" },
      user: "Barb Ara",
      isDisabled: false,
    });
  });
});
