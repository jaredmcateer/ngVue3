import { string } from "yargs";

export const SPECIAL_ATTRS = ["class", "style"];

/**
 * Handles extracting special attributes that can either be regular HTML
 * attributes and/or angular bindings (e.g., class/ng-class) that we're
 * interested in transferring to the Vue component
 *
 * @param attributes
 * @returns a map of special attributes
 */
export function extractSpecialAttributes(attributes: ng.IAttributes) {
  return SPECIAL_ATTRS.reduce((accumulator, key) => {
    const ngKey = `ng-${key}`;
    const value = attributes[key];

    if (value || attributes[attributes.$normalize(ngKey)]) {
      accumulator[key] = value || "";
    }

    return accumulator;
  }, {} as Record<string, string>);
}
