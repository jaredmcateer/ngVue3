import angular from "angular";
import { ngVueComponent, useNgVue } from "../../main";
import { ngHtmlCompiler } from "../../utils/ngHtmlCompiler";
import { NgVueProvider, useNgVuePlugins } from "../ngVueProvider";
import { CustomNgVuePluginConfig, useCustomNgVuePlugin } from "./__fixtures__/NgVuePlugin";
import Button from "./__fixtures__/Button.vue";
import { MyService } from "./__fixtures__/MyService";

interface TestScope extends ng.IScope {
  handleButtonClick: (val: number) => number;
}

describe("NgVueProvider", () => {
  let ngVueProvider: NgVueProvider;
  let compile: ReturnType<typeof ngHtmlCompiler>;
  let scope: TestScope;
  let $compileProvider: ng.ICompileProvider;
  let element: JQLite;

  beforeEach(angular.mock.module(useNgVue()));
  beforeEach(angular.mock.module(useNgVuePlugins()));
  beforeEach(angular.mock.module(useCustomNgVuePlugin()));

  describe("Injectables", () => {
    beforeEach(
      angular.mock.module(
        (
          _$ngVueProvider_: NgVueProvider,
          _$provide_: ng.auto.IProvideService,
          _$compileProvider_: ng.ICompileProvider
        ) => {
          $compileProvider = _$compileProvider_;
          _$provide_.service("myService", MyService);

          ngVueProvider = _$ngVueProvider_;
          ngVueProvider.provide("foo", 1001);
          (ngVueProvider.plugins.customNgVuePlugin as CustomNgVuePluginConfig).register([
            "make",
            "colour",
            "quantity",
          ]);

          $compileProvider.directive(...ngVueComponent("myButton", Button));
        }
      )
    );

    beforeEach(
      angular.mock.inject((_$rootScope_: ng.IRootScopeService, _$compile_: ng.ICompileService) => {
        compile = ngHtmlCompiler(_$compile_);
        scope = (function (): TestScope {
          const tmpScope: any = _$rootScope_.$new();
          tmpScope.handleButtonClick = jest.fn();
          return tmpScope;
        })();

        element = compile(`<my-button v-on-button-clicked="handleButtonClick"></my-button>`, scope);
      })
    );

    it("should provide values from NgVueProvider#provide method", () => {
      element.find("button")[0].click();
      scope.$digest();
      expect(scope.handleButtonClick).toHaveBeenCalledWith(1001);
    });

    it("should provide values from custom NgVue Plugins", () => {
      expect(element.find("button")[0].textContent).toEqual("gray Kerluke: 80");
    });
  });
});
