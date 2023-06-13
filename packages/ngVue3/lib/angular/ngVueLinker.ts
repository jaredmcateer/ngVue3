import angular from "angular";
import {
  App,
  Component,
  ComputedOptions,
  createApp,
  Directive,
  h,
  MethodOptions,
  onMounted,
  ref,
  resolveDirective,
  withDirectives,
} from "vue";
import { evaluateEvents } from "../components/evaluateEvents";
import { evaluateValues } from "../components/evaluateValues";
import { evaluateDirectives, NgVueDirective } from "../components/evaluateDirectives";
import { extractSpecialAttributes } from "../components/extractSpecialAttributes";
import { getExpressions } from "../components/getExpressions";
import { WatchExpressionOptions, watchExpressions } from "../components/watchExpressions";
import { clearInstanceState, getInstanceState, InstanceState } from "../instanceStore";
import { NgVueService } from "./ngVueProvider";
import { getComponentName } from "../utils/getComponentName";

export function ngVueLinker(
  Component: any,
  jqElement: JQLite,
  attrs: ng.IAttributes,
  scope: ng.IScope,
  $injector: ng.auto.IInjectorService
) {
  // Create unique key for retrieving state information
  const instanceKey = Symbol("ngVueInstanceKey");
  const state = getInstanceState(instanceKey);
  const removeAttrFn = getAttrRemoveFunction(jqElement, attrs);
  const attrExpressions = getExpressions(attrs, removeAttrFn);
  const events = evaluateEvents(attrExpressions.events, scope);
  const ngVueDirectives = evaluateDirectives(attrs.vDirectives, scope);

  Object.assign(state.props, evaluateValues(attrExpressions.props, scope));
  Object.assign(state.attrs, evaluateValues(attrExpressions.attrs, scope));
  Object.assign(state.special, extractSpecialAttributes(attrs, removeAttrFn));

  const options: WatchExpressionOptions = { depth: attrs.watchDepth };
  removeAttrFn("watchDepth");

  watchExpressions(attrExpressions.props, state.props, scope, options);
  watchExpressions(attrExpressions.attrs, state.attrs, scope, options);

  let html = getInnerHtml(jqElement[0]);

  let vueInstance = createAppInstance(Component, html, state, events, ngVueDirectives);
  loadNgVueGlobals(vueInstance, $injector);
  vueInstance.mount(jqElement[0]);

  scope.$on("$destroy", () => {
    vueInstance.unmount();
    if (vueInstance._container) {
      angular.element(vueInstance._container).remove();
    }
    // @ts-ignore We're dereferencing this variable for garbage collection
    vueInstance = null;
    clearInstanceState(instanceKey);
  });
}

/**
 * Constructs the initial Vue App instance
 * @param Component
 * @param html
 * @param state
 * @param events
 * @param ngVueDirectives
 * @returns
 */
function createAppInstance(
  Component: any,
  html: Element | undefined,
  state: InstanceState,
  events: Record<string, (...args: unknown[]) => unknown> | null,
  ngVueDirectives: NgVueDirective[]
) {
  return createApp({
    name: `NgVue${getComponentName(Component)}`,
    setup() {
      const slot = ref<HTMLSpanElement | null>(null);

      onMounted(() => {
        if (html) {
          try {
            slot.value?.parentElement?.replaceChild(html, slot.value);
          } catch (err) {
            console.error(
              "Attempted to insert content into slot and something went wrong. " +
                "Inserting content, especially angular content, into a components slot is not advisable. " +
                "This is a pretty hacky implementation in ngVue. " +
                "Open an issue at https://github.com/jaredmcateer/ngvue3/issues with details."
            );
          }
        }
      });

      return () => {
        let node = h(
          Component,
          { ...state.props, ...state.attrs, ...state.special, ...events },
          () => [h("span", { ref: slot })]
        );

        if (ngVueDirectives.length > 0) {
          const directives = ngVueDirectives
            .filter((d) => !!resolveDirective(d.name))
            .map((d): [Directive, any, any, any] => {
              const directive = resolveDirective(d.name)!; // already filtered undefined
              return [directive, d.value, d.arg, d.modifiers];
            });

          node = withDirectives(node, directives);
        }

        return node;
      };
    },
  });
}

/**
 * Loads the globals such as Injectables, Plugins, Directives, and Components
 * that has been added via the ngVueProvider
 *
 * @param vueInstance
 * @param $injector
 */
function loadNgVueGlobals(vueInstance: App<Element>, $injector: ng.auto.IInjectorService) {
  const $ngVue: NgVueService | null = $injector.has("$ngVue") ? $injector.get("$ngVue") : null;

  if (!$ngVue) return;

  $ngVue.initNgVuePlugins(vueInstance);
  $ngVue.getVuePlugins().forEach((plugin) => vueInstance.use(plugin));
  $ngVue.getInjectables().forEach(([key, value]) => vueInstance.provide(key, value));
  Object.entries($ngVue.getVueDirectives()).forEach(([name, directive]) =>
    vueInstance.directive(name, directive)
  );
  Object.entries($ngVue.getVueComponents()).forEach(([name, component]) =>
    vueInstance.component(name, component)
  );
}

function getInnerHtml(element: HTMLElement) {
  if (element.innerHTML.trim()) {
    let html: Element;
    if (element.children.length === 0) {
      const span = document.createElement("span");
      span.innerHTML = element.innerHTML.trim();
      html = span;
    } else {
      html = element.children[0];
    }

    return html;
  }
}

function getAttrRemoveFunction(element: JQLite, attributes: ng.IAttributes) {
  return (attr: string) => {
    const denormalizedAttr = (attributes.$attr as Record<string, string>)[attr];
    element.removeAttr(denormalizedAttr);
  };
}
