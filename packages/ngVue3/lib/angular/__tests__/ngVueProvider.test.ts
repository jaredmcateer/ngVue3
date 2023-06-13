import angular from "angular";
import { ngVueComponent, useNgVue } from "../../main";
import { ngHtmlCompiler } from "../../utils/ngHtmlCompiler";
import { NgVueProvider, useNgVuePlugins } from "../ngVueProvider";
import { CustomNgVuePluginConfig, useCustomNgVuePlugin } from "./__fixtures__/NgVuePlugin";
import Button from "./__fixtures__/Button.vue";
import { MyService, MyServiceKey } from "./__fixtures__/MyService";
import GlobalComponentConsumer from "./__fixtures__/GlobalComponentConsumer.vue";
import MyGlobalComponent from "./__fixtures__/MyGlobalComponent.vue";

interface TestScope extends angular.IScope {
  handleButtonClick: (val: number) => number;
}

describe("NgVueProvider", () => {
  let ngVueProvider: NgVueProvider;
  let compile: ReturnType<typeof ngHtmlCompiler>;
  let scope: TestScope;
  let $compileProvider: angular.ICompileProvider;
  let element: JQLite;

  beforeEach(angular.mock.module(useNgVue()));
  beforeEach(angular.mock.module(useNgVuePlugins()));
  beforeEach(angular.mock.module(useCustomNgVuePlugin()));

  describe("Injectables", () => {
    beforeEach(
      angular.mock.module(
        (
          _$ngVueProvider_: NgVueProvider,
          _$provide_: angular.auto.IProvideService,
          _$compileProvider_: angular.ICompileProvider
        ) => {
          $compileProvider = _$compileProvider_;
          _$provide_.service("myService", MyService);

          const addOne = (val: number) => val + 1;

          ngVueProvider = _$ngVueProvider_;
          ngVueProvider.provide("foo", 1001);
          ngVueProvider.provide(MyServiceKey, addOne);
          ngVueProvider.directive("hello", {
            created(el: HTMLElement) {
              const span = document.createElement("span");
              span.textContent = "Hello!";
              el.appendChild(span);
            },
          });
          ngVueProvider.directive("hello2", {
            created(el: HTMLElement, binding) {
              const span = document.createElement("span");
              span.textContent = binding.value ?? "Hello?";

              if (binding.arg === "respond") {
                span.textContent += " Hi.";
              }

              el.appendChild(span);
            },
          });
          ngVueProvider.directive("hello3", {
            created(el: HTMLElement, binding) {
              const span = document.createElement("span");
              span.textContent = binding.value ?? "Nothing?";
              if (binding.modifiers.shout) {
                span.textContent = (span.textContent ?? "").toUpperCase();
              }
              el.appendChild(span);
            },
          });

          ngVueProvider.component("myGlobalComponent", MyGlobalComponent);

          (ngVueProvider.plugins.customNgVuePlugin as CustomNgVuePluginConfig).register([
            "make",
            "colour",
            "quantity",
          ]);

          $compileProvider.directive(...ngVueComponent("myButton", Button));
          $compileProvider.directive(
            ...ngVueComponent("globalComponentConsumer", GlobalComponentConsumer)
          );
        }
      )
    );

    beforeEach(
      angular.mock.inject(
        (_$rootScope_: angular.IRootScopeService, _$compile_: angular.ICompileService) => {
          compile = ngHtmlCompiler(_$compile_);
          scope = (function (): TestScope {
            const tmpScope: any = _$rootScope_.$new();
            tmpScope.handleButtonClick = jest.fn();
            return tmpScope;
          })();

          element = compile(
            `<my-button v-on-button-clicked="handleButtonClick"></my-button>`,
            scope
          );
        }
      )
    );

    it("should provide values from NgVueProvider#provide method", () => {
      element.find("button")[0].click();
      scope.$digest();
      // Combination of injectables foo which provides 1001 and MyServiceKey
      // which adds 1 to the value
      expect(scope.handleButtonClick).toHaveBeenCalledWith(1002);
    });

    it("should provide values from custom NgVue Plugins", () => {
      expect(element.find("button")[0].textContent).toEqual("gray Kerluke: 80");
    });

    describe("directives", () => {
      it("should process a directive passed by string", () => {
        element = compile(
          `<my-button v-directives="'hello'" v-on-button-clicked="handleButtonClick"></my-button>`,
          scope
        );
        scope.$digest();
        expect(element.find("span")[0].textContent).toEqual("Hello!");
      });

      it("should process multiple directives passed by string", () => {
        element = compile(
          `<my-button v-directives="'hello,hello2,,hello3,'" v-on-button-clicked="handleButtonClick"></my-button>`,
          scope
        );
        scope.$digest();
        expect(element.find("span")[0].textContent).toEqual("Hello!");
        expect(element.find("span")[1].textContent).toEqual("Hello?");
        expect(element.find("span")[2].textContent).toEqual("Nothing?");
      });

      it("should process a directive passed by object", () => {
        element = compile(
          `<my-button v-directives="{name: 'hello2', value: 'hello!?'}" v-on-button-clicked="handleButtonClick"></my-button>`,
          scope
        );
        scope.$digest();
        expect(element.find("span")[0].textContent).toEqual("hello!?");
      });

      it("should process a directive passed by object with arg", () => {
        element = compile(
          `<my-button v-directives="{name: 'hello2', value: 'hello!?', arg: 'respond'}" v-on-button-clicked="handleButtonClick"></my-button>`,
          scope
        );
        scope.$digest();
        expect(element.find("span")[0].textContent).toEqual("hello!? Hi.");
      });

      it("should process a directive passed by object with modifiers", () => {
        element = compile(
          `<my-button v-directives="{
            name: 'hello3', value: 'hello!?', modifiers: {shout: true}
          }" v-on-button-clicked="handleButtonClick"></my-button>`,
          scope
        );
        scope.$digest();
        expect(element.find("span")[0].textContent).toEqual("HELLO!?");
      });

      it("should process directives passed by an array of object", () => {
        element = compile(
          `<my-button v-directives="[
            {name: 'hello' },
            {name: 'hello2', value: 'hallo?', arg: 'respond'},
            {name: 'hello3', value: 'hello!?', modifiers: {shout: true}}
          ]" v-on-button-clicked="handleButtonClick"></my-button>`,
          scope
        );
        scope.$digest();
        expect(element.find("span")[0].textContent).toEqual("Hello!");
        expect(element.find("span")[1].textContent).toEqual("hallo? Hi.");
        expect(element.find("span")[2].textContent).toEqual("HELLO!?");
      });
    });

    describe("global components", () => {
      beforeEach(
        angular.mock.inject(
          (_$rootScope_: angular.IRootScopeService, _$compile_: angular.ICompileService) => {
            compile = ngHtmlCompiler(_$compile_);
            scope = (function (): TestScope {
              const tmpScope: any = _$rootScope_.$new();
              tmpScope.handleButtonClick = jest.fn();
              return tmpScope;
            })();

            element = compile(`<global-component-consumer></global-component-consumer>`, scope);
          }
        )
      );

      it("should render a global component", () => {
        expect(element.find("div")[0]).toBeDefined();
        expect(element.find("div")[0].classList.contains("my-global-component")).toBeTruthy();
        expect(element.find("div")[0].textContent).toEqual("Hello Jane!");
      });
    });
  });
});
