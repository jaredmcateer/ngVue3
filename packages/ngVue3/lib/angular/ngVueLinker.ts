import { createApp } from "vue";
import { getExpressions } from "../components/getExpressions";
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
}
