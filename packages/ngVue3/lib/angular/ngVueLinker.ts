import { createApp } from "vue";
import { evaluateEvents } from "../components/evaluateEvents";
import { evaluateValues } from "../components/evaluateValues";
import { extractSpecialAttributes } from "../components/extractSpecialAttributes";
import { getExpressions } from "../components/getExpressions";
import { WatchExpressionOptions, watchExpressions } from "../components/watchExpressions";
import { watchSpecialAttributes } from "../components/watchSpecialAttributes";
import { getInstanceState } from "../instanceStore";

export function ngVueLinker(
  Component: unknown,
  jqElement: JQLite,
  attrs: ng.IAttributes,
  scope: ng.IScope
) {
  if (!jqElement.parent().length) {
    throw new Error("ngVue components must have a parent tag or they will not render");
  }

  // Create unique key for retrieving state information
  const instanceKey = Symbol("ngVueInstanceKey");
  const instanceState = getInstanceState(instanceKey);
  const attrExpressions = getExpressions(attrs);
  const events = evaluateEvents(attrExpressions.events, scope);

  Object.assign(instanceState.props, evaluateValues(attrExpressions.props, scope));
  Object.assign(instanceState.attrs, evaluateValues(attrExpressions.attrs, scope));
  Object.assign(instanceState.special, extractSpecialAttributes(attrs));

  const options: WatchExpressionOptions = { depth: attrs.watchDepth };

  watchExpressions(attrExpressions.props, instanceState.props, scope, options);
  watchExpressions(attrExpressions.attrs, instanceState.attrs, scope, options);
  watchSpecialAttributes(instanceState.special, jqElement, scope);
}
