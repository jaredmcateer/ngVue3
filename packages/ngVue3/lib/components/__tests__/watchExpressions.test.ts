import angular from "angular";
import { reactive } from "vue";
import { useNgVue } from "../../main";
import { evaluateValues } from "../evaluateValues";
import { ExpressionsMap } from "../getExpressions";
import { watchExpressions } from "../watchExpressions";

interface TestScope extends ng.IScope {
  person: { name: string; email: string };
  people: Array<{ name: string; email: string }>;
  numbers: number[];
  foo: string;
}

describe("watchExpression", () => {
  let expressionMap: ExpressionsMap;
  let scope: TestScope;

  beforeEach(() => angular.mock.module(useNgVue()));
  beforeEach(
    angular.mock.inject((_$rootScope_: ng.IRootScopeService) => {
      function extendScope(s: any): TestScope {
        s.person = { name: "Barb Ara", email: "barb.ara@example.com" };
        s.people = [{ ...s.person }, { name: "Jo Nathan", email: "jnathan@example.org" }];
        s.numbers = [1, 2, 3];
        s.foo = "foo";
        return s;
      }

      scope = extendScope(_$rootScope_.$new());
    })
  );

  it("should setup watcher", () => {
    expressionMap = {
      __ngvue_props__: "{people}",
      myFoo: "foo",
      user: "person",
      someNumbers: "numbers",
    };

    const state = Object.assign(reactive({}), evaluateValues(expressionMap, scope));

    expect(state.user).toEqual(scope.person);
    expect(state.people).toEqual(scope.people);
    expect(state.myFoo).toEqual("foo");
    expect(state.someNumbers).toEqual([1, 2, 3]);

    watchExpressions(expressionMap, state, scope);

    scope.person.email = "barb.ara@gmail.com";
    scope.people.push({ name: "Paul Lee", email: "plee@example.net" });
    scope.foo = "bar";
    scope.numbers[0] = 2;
    scope.$digest();

    expect(state.myFoo).toEqual("bar");
    expect(state.people).toHaveLength(3);
    expect((state.user as Record<string, string>).email).toEqual("barb.ara@gmail.com");
    expect((state.someNumbers as number[])[0]).toEqual(2);
  });
});
