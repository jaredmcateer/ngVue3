import { ExpressionsMap } from "./getExpressions";
import angular from "angular";

export function evaluateEvents(events: ExpressionsMap, scope: ng.IScope) {
  if (!(events && angular.isObject(events))) {
    return {};
  }

  const evaluatedEvents = Object.keys(events).reduce((accumulator, key) => {
    const fn = scope.$eval(events[key]);

    if (!angular.isFunction(fn)) {
      accumulator[key] = fn;
      console.warn(`[ngVue] Bound a non-function as an event handler (${key})`);
    } else {
      accumulator[key] = function () {
        return scope.$evalAsync(() => fn.apply(null, arguments));
      };
    }

    return accumulator;
  }, {} as Record<string, (...args: unknown[]) => unknown | unknown>);

  return evaluatedEvents;
}
