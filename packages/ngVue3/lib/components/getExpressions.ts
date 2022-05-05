import { extractHtmlAttributes } from "./extractHtmlAttributes";
import { extractExpressionName } from "./extractExpressionName";

const attributeMap = {
  props: "vProps",
  on: "vOn",
} as const;
Object.freeze(attributeMap);

function isAttributeMapKey(
  expressionType: ExpressionTypes
): expressionType is keyof typeof attributeMap {
  return expressionType in attributeMap;
}

export type ExpressionsMap = Record<string, string>;

type ExpressionTypes = keyof typeof attributeMap | "attrs";

export function extractExpressions(
  expressionType: ExpressionTypes,
  attributes: ng.IAttributes,
  removeAttrFn: (attr: string) => void
) {
  let expressions: string[] = [];
  let key: "vProps" | "vOn";
  let extractExpressionFn: (accumulator: ExpressionsMap, attrKey: string) => ExpressionsMap;
  let baseExpressionMap: ExpressionsMap = {};

  if (isAttributeMapKey(expressionType)) {
    key = attributeMap[expressionType];
    const objectExpression = attributes[key];

    // vProps: "{...}" without key, add to "safe" key for processing
    if (objectExpression !== undefined) {
      baseExpressionMap.__ngvue_props__ = objectExpression;
      removeAttrFn(key);
    }

    const propRegExp = new RegExp(`^${key}.+`, "i");
    expressions = Object.keys(attributes).filter((attr) => propRegExp.test(attr));

    extractExpressionFn = (accumulator, attrKey) => {
      const exprName = extractExpressionName(attrKey, key);
      if (exprName) {
        accumulator[exprName] = attributes[attrKey];
        removeAttrFn(attrKey);
      }
      return accumulator;
    };
  } else {
    // Non-prefixed attributes (i.e., a regular HTML attribute)
    expressions = extractHtmlAttributes(attributes);

    extractExpressionFn = (accumulator, attrKey) => {
      // Get original attribute name from $attr not normalized by Angular (e.g., data-my-attr and not my-attr)
      const denormalizedAttr: string = (attributes.$attr as any)[attrKey];

      // Handle attributes with no value. e.g., <button disabled></button>
      accumulator[denormalizedAttr] =
        attributes[attrKey] === "" ? `${attrKey}` : attributes[attrKey];

      removeAttrFn(attrKey);

      return accumulator;
    };
  }

  const expressionsMap = expressions.reduce(extractExpressionFn, baseExpressionMap);
  return expressionsMap;
}

export function getExpressions(attributes: ng.IAttributes, removeAttrFn: (attr: string) => void) {
  return {
    props: extractExpressions("props", attributes, removeAttrFn) || {},
    events: extractExpressions("on", attributes, removeAttrFn) || {},
    attrs: extractExpressions("attrs", attributes, removeAttrFn) || {},
  };
}
