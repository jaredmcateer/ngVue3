import angular from "angular";
import ScriptSetupVue from "./__fixtures__/ScriptSetup.vue";
import CompositionComponentVue from "./__fixtures__/CompositionComponent.vue";
import OptionsComponent from "./__fixtures__/OptionsComponent.vue";
import { ngVueComponent } from "../../helpers/ngVueComponent";
import { nextTick } from "vue";
import { ngHtmlCompiler } from "../../utils/ngHtmlCompiler";
import { useNgVue } from "../../main";

interface TestScope extends ng.IScope {
  user: { firstName: string; lastName: string };
  isAdmin: boolean;
}

describe.each`
  style                 | Component
  ${"Options API"}      | ${OptionsComponent}
  ${"Composition API"}  | ${CompositionComponentVue}
  ${"Script Setup API"} | ${ScriptSetupVue}
`("ngVueLinker ($style)", ({ Component }) => {
  let $compileProvider: ng.ICompileProvider;
  let scope: TestScope;
  let compile: ReturnType<typeof ngHtmlCompiler>;

  beforeEach(angular.mock.module(useNgVue()));
  beforeEach(
    angular.mock.module((_$compileProvider_: ng.ICompileProvider) => {
      $compileProvider = _$compileProvider_;
    })
  );

  beforeEach(
    angular.mock.inject((_$rootScope_: ng.IRootScopeService, _$compile_: ng.ICompileService) => {
      compile = ngHtmlCompiler(_$compile_);
      scope = (function (): TestScope {
        const tmpScope: any = _$rootScope_.$new();
        tmpScope.user = { firstName: "Burt", lastName: "Macklin" };
        tmpScope.isAdmin = true;
        return tmpScope;
      })();
    })
  );

  beforeEach(() => {
    $compileProvider.directive(...ngVueComponent("myComponent", Component));
  });

  describe("Render", () => {
    it("should render the component", () => {
      const element = compile("<my-component />", scope);
      expect(element[0]).toMatchSnapshot();
    });

    it("should not render the component if angular is preventing it", () => {
      const element = compile(`<my-component ng-if="false" />`, scope);
      expect(element[0]).toMatchSnapshot();
    });

    it("should render user details when provided as an object", () => {
      const element = compile(`<my-component v-props="user" />`, scope);
      expect(element[0]).toMatchSnapshot();
    });

    it("should render button when provided as a named prop", () => {
      const element = compile(`<my-component v-props-is-admin="isAdmin" />`, scope);
      expect(element[0]).toMatchSnapshot();
    });

    it("should render user details and button when provided as a mixed prop types", () => {
      const element = compile(`<my-component v-props="user" v-props-is-admin="isAdmin" />`, scope);
      expect(element[0]).toMatchSnapshot();
    });
  });

  describe("Property Reactivity", () => {
    describe(`(v-props-*="...")`, () => {
      it("should update named props when changes are made", async () => {
        const element = compile(
          `<my-component v-props-first-name="user.firstName" v-props-last-name="user.lastName" v-props-is-admin="isAdmin" />`,
          scope
        );
        scope.user.firstName = "Barb";
        scope.user.lastName = "Ara";
        scope.isAdmin = false;
        scope.$digest();
        await nextTick();

        expect(element[0]).toMatchSnapshot();
      });
    });

    describe(`(v-props="...")`, () => {
      it("should update when reference changes", async () => {
        const element = compile(
          `<my-component v-props="user" v-props-is-admin="isAdmin" />`,
          scope
        );
        scope.user = { firstName: "Bart", lastName: "Moklen" };
        scope.$digest();
        await nextTick();

        expect(element[0]).toMatchSnapshot();
      });

      it("should not update when property value changes when observing for reference changes", async () => {
        const element = compile(
          `<my-component v-props="user" v-props-is-admin="isAdmin" />`,
          scope
        );
        scope.user.firstName = "Bort";
        scope.user.lastName = "Muklyn";
        scope.$digest();
        await nextTick();

        expect(element[0]).toMatchSnapshot();
      });

      it("should update when property value changes only when observing at value depth", async () => {
        const element = compile(
          `<my-component v-props="user" v-props-is-admin="isAdmin" watch-depth="value" />`,
          scope
        );
        scope.user.firstName = "Bort";
        scope.user.lastName = "Muklyn";
        scope.$digest();
        await nextTick();

        expect(element[0]).toMatchSnapshot();
      });
    });
  });
});
