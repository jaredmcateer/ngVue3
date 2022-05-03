import { ExpressionsMap } from "./getExpressions";

export function evaluateValues(expressions: ExpressionsMap, scope: ng.IScope) {
  if (!expressions) return {};

  const evaluatedValues = Object.keys(expressions).reduce((accumulator, prop) => {
    if (prop === "__ngvue_props__") {
      Object.assign(accumulator, scope.$eval(expressions.__ngvue_props__));
    } else {
      accumulator[prop] = scope.$eval(expressions[prop]);
    }

    return accumulator;
  }, {} as Record<string, unknown>);

  return evaluatedValues;
}
