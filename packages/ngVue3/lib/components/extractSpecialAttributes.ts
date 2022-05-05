export const SPECIAL_ATTRS = ["class", "style"];

/**
 * Handles extracting special attributes that can either be regular HTML
 * attributes and/or angular bindings (e.g., class/ng-class) that we're
 * interested in transferring to the Vue component
 *
 * @param attributes
 * @returns a map of special attributes
 */
export function extractSpecialAttributes(
  attributes: ng.IAttributes,
  removeAttrFn: (attr: string) => void
) {
  return SPECIAL_ATTRS.reduce((accumulator, key) => {
    accumulator[key] = attributes[key] || "";
    removeAttrFn(key);
    return accumulator;
  }, {} as Record<string, string>);
}
