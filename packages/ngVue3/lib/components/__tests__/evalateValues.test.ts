import angular from "angular";
import "angular-mocks";
import { ExpressionsMap } from "../getExpressions";
import { evaluateValues } from "../evaluateValues";
import { useNgVue } from "../../main";

interface TestScope extends ng.IScope {
  address?: Record<string, string>;
  name?: string;
  disabled?: boolean;
}

describe("Evaluating expressions maps", () => {
  let scope: TestScope;
  let expressionsMap: ExpressionsMap;

  beforeEach(() => {
    angular.mock.module(useNgVue());

    angular.mock.inject((_$rootScope_: ng.IRootScopeService) => {
      function extendScope(s: any): TestScope {
        s.address = { street: "123 fake st", city: "Anytown" };
        s.name = "Barb Ara";
        s.disabled = false;
        return s;
      }
      scope = extendScope(_$rootScope_.$new());
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
