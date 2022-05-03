import { SPECIAL_ATTRS } from "./extractSpecialAttributes";
const excludedAttributes: ReadonlyArray<string> = [
  "vProps",
  "vOn",
  "vDirectives",
  "vWatchDepth",
  "ng",
  ...SPECIAL_ATTRS,
];
const excludePattern = new RegExp(`^(${excludedAttributes.join("|")})`, "i");

/**
 * Extracts HTML attributes on the angular that should be applied the Vue component. Special attributes
 * @param attributes
 * @returns
 */
export function extractHtmlAttributes(attributes: ng.IAttributes): string[] {
  return Object.keys(attributes).filter((attribute) => {
    const isSpecialAttribute = excludePattern.test(attribute);
    const isAngularInternal = attribute[0] === "$";

    return !(isSpecialAttribute || isAngularInternal);
  });
}
