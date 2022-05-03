import { InstanceStateObj } from "../instanceStore";

/**
 * TODO FIX THIS?
 * This is supposed to update class and style when the attribute when the
 * class changes but it seems to be slightly buggy and requires an additional
 * digest for the class to show up. Style appears to be non-functional
 * @param state
 * @param element
 * @param scope
 */
export function watchSpecialAttributes(state: InstanceStateObj, element: JQLite, scope: ng.IScope) {
  Object.keys(state).forEach((key) => {
    // use scope.$watch instead of attrs.$observe because we want to catch changes
    // in attribute value that don't necessarily come directly from interpolation
    scope.$watch(
      () => element.attr(key),
      (newValue) => {
        state[key] = newValue;
      }
    );
  });
}
