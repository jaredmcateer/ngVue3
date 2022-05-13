import angular from "angular";
import "angular-mocks";
import { useNgVue } from "../../main";
import { evaluateDirectives } from "../evaluateDirectives";

interface TestScope extends ng.IScope {
  foo?: string;
}

describe("Evaluating expressions maps", () => {
  let scope: TestScope;

  beforeEach(() => {
    let $rootScope: ng.IRootScopeService;
    angular.mock.module(useNgVue());

    angular.mock.inject((_$rootScope_: ng.IRootScopeService) => {
      $rootScope = _$rootScope_;

      scope = $rootScope.$new();
      scope.foo = "bar";
    });
  });

  it("should evaluate a single string based directive", () => {
    expect(evaluateDirectives("'hello'", scope)).toEqual([{ name: "hello" }]);
  });

  it("should evaluate a multi-string based directive", () => {
    expect(evaluateDirectives("'hello,world'", scope)).toEqual([
      { name: "hello" },
      { name: "world" },
    ]);
  });

  it("should evaluate a multi-string based directive and ignore blank elements", () => {
    expect(evaluateDirectives("'hello,,,,world'", scope)).toEqual([
      { name: "hello" },
      { name: "world" },
    ]);
  });

  it("should evaluate a directive argument", () => {
    expect(
      evaluateDirectives(
        "{name: 'hello', value: 'hello world', arg: 'foo', modifiers: {bar: true}}",
        scope
      )
    ).toEqual([{ name: "hello", value: "hello world", arg: "foo", modifiers: { bar: true } }]);
  });

  it("should evaluate an array directive arguments", () => {
    expect(
      evaluateDirectives(
        "[{name: 'hello', value: 'hello world', arg: 'foo', modifiers: {bar: true}}, {name: 'foo'}]",
        scope
      )
    ).toEqual([
      { name: "hello", value: "hello world", arg: "foo", modifiers: { bar: true } },
      { name: "foo" },
    ]);
  });
});
