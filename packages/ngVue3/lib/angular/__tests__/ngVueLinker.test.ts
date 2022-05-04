import angular from "angular";
import CompositionComponentVue from "./__fixtures__/CompositionComponent.vue";
import OptionsComponent from "./__fixtures__/OptionsComponent.vue";
import ScriptSetupVue from "./__fixtures__/ScriptSetup.vue";
import { createVueComponent } from "../../helpers/createVueComponent";

interface TestScope extends ng.IScope {
  person: { firstName: string; lastName: string };
  isAdmin: boolean;
}

describe.each`
  style                 | Component
  ${"Options API"}      | ${OptionsComponent}
  ${"Composition API"}  | ${CompositionComponentVue}
  ${"Script Setup API"} | ${ScriptSetupVue}
`("ngVueLinker ($style)", ({ Component }) => {
  let $compileProvider: ng.ICompileProvider;
  let $compile: ng.ICompileService;
  let scope: ng.IScope;

  beforeEach(angular.mock.module("ngVue"));
  beforeEach(
    angular.mock.module((_$compileProvider_: ng.ICompileProvider) => {
      $compileProvider = _$compileProvider_;
    })
  );

  beforeEach(
    angular.mock.inject((_$rootScope_: ng.IRootScopeService, _$compile_: ng.ICompileService) => {
      const scope = (function (): TestScope {
        const tmpScope: any = _$rootScope_.$new();
        tmpScope.person = { firstName: "Burt", lastName: "Macklin" };
        tmpScope.isAdmin = true;
        return tmpScope;
      })();
    })
  );

  describe("Render", () => {
    beforeEach(() => {
      $compileProvider.directive(...createVueComponent("my-component", Component));
    });

    it("should render the component", () => {
      const element = $compile("<my-component />")(scope);
      expect(element[0]).toMatchSnapshot();
    });
  });
});
