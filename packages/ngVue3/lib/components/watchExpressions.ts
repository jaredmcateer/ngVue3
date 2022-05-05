import angular from "angular";
import { InstanceStateObj } from "../instanceStore";
import { ExpressionsMap } from "./getExpressions";

export interface WatchExpressionOptions {
  depth: "value" | "collection" | "reference";
}

/**
 * Sets up angular watches that notify the app instance state which updates
 * reactive properties and attributes
 * @param expressions
 * @param state
 * @param scope
 * @param options
 */
export function watchExpressions(
  expressions: ExpressionsMap,
  state: InstanceStateObj,
  scope: ng.IScope,
  options: WatchExpressionOptions = { depth: "reference" }
) {
  if (!expressions) return;

  const watcher = getWatcher(expressions, state);

  switch (options.depth) {
    case "value":
      watcher((expression, setter) => scope.$watch(expression, setter, true));
      break;
    case "collection":
      watcher((expression, setter) => scope.$watchCollection(expression, setter));
      break;
    case "reference":
    default:
      watcher((expression, setter) => scope.$watch(expression, setter));
      break;
  }
}

type WatchSetter = (value: unknown) => void;
type WatcherCallback = (expression: string, setter: WatchSetter) => void;

function isNgPropsObject(name: string, value: unknown): value is Record<string, unknown> {
  return name === "__ngvue_props__" && angular.isObject(value);
}

function getWatcher(expressions: ExpressionsMap, state: InstanceStateObj) {
  return (callback: WatcherCallback) => {
    Object.keys(expressions).forEach((name) => {
      const setter: WatchSetter = (value) => {
        if (isNgPropsObject(name, value)) {
          Object.keys(value).forEach((key) => {
            state[key] = value[key];
          });
        } else {
          state[name] = value;
        }
      };

      callback(expressions[name], setter);
    });
  };
}
