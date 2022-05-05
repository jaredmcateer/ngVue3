import angular from "angular";
import { createApp, DefineComponent, h, onMounted, ref, toRefs } from "vue";
import { evaluateEvents } from "../components/evaluateEvents";
import { evaluateValues } from "../components/evaluateValues";
import { extractSpecialAttributes } from "../components/extractSpecialAttributes";
import { getExpressions } from "../components/getExpressions";
import { WatchExpressionOptions, watchExpressions } from "../components/watchExpressions";
import { watchSpecialAttributes } from "../components/watchSpecialAttributes";
import { getInstanceState } from "../instanceStore";

export function ngVueLinker(
  Component: any,
  jqElement: JQLite,
  attrs: ng.IAttributes,
  scope: ng.IScope
) {
  // Create unique key for retrieving state information
  const instanceKey = Symbol("ngVueInstanceKey");
  const state = getInstanceState(instanceKey);
  const removeAttrFn = getAttrRemoveFunction(jqElement, attrs);
  const attrExpressions = getExpressions(attrs, removeAttrFn);
  const events = evaluateEvents(attrExpressions.events, scope);

  Object.assign(state.props, evaluateValues(attrExpressions.props, scope));
  Object.assign(state.attrs, evaluateValues(attrExpressions.attrs, scope));
  Object.assign(state.special, extractSpecialAttributes(attrs, removeAttrFn));

  const options: WatchExpressionOptions = { depth: attrs.watchDepth };
  removeAttrFn("watchDepth");

  watchExpressions(attrExpressions.props, state.props, scope, options);
  watchExpressions(attrExpressions.attrs, state.attrs, scope, options);
  watchSpecialAttributes(state.special, jqElement, scope);

  let html = getInnerHtml(jqElement[0]);

  let vueInstance = createApp({
    name: `NgVue-${Component.name || "UnnamedComponent"}`,
    setup() {
      const slot = ref<HTMLSpanElement | null>(null);

      onMounted(() => {
        if (html) {
          slot.value?.replaceChild(html, slot.value);
        }
      });

      return () =>
        h(Component, { ...state.props, ...state.attrs, ...state.special, ...events }, [
          h("span", { ref: slot }),
        ]);
    },
  });

  vueInstance.mount(jqElement[0]);

  scope.$on("$destroy", () => {
    vueInstance.unmount();
    if (vueInstance._container) {
      angular.element(vueInstance._container).remove();
    }
    // @ts-ignore We're dereferencing this variable for garbage collection
    vueInstance = null;
  });
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
