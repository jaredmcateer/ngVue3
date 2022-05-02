import { extractHtmlAttributes } from "./extractHtmlAttributes";
import { extractExpressionName } from "./extractExpressionName";

const attributeMap = {
  props: "vProps",
  on: "vOn",
} as const;
Object.freeze(attributeMap);

type ExpressionsMap = Record<string, string>;

type ExpressionTypes = keyof typeof attributeMap | "attrs";

export function extractExpressions(expressionType: ExpressionTypes, attributes: ng.IAttributes) {
  let expressions: string[];
  let key: "vProps" | "vOn";
  let extractExpressionFn: (accumulator: ExpressionsMap, expression: string) => ExpressionsMap;
  let baseExpressionMap: ExpressionsMap = {};

  if (expressionType in attributeMap) {
    key = attributeMap[expressionType];
    const objectExpression = attributes[key];

    // vProps: "{...}" without key, add to "safe" key for processing
    if (objectExpression !== undefined) {
      baseExpressionMap.__ngvue_props__ = objectExpression;
    }

    const propRegExp = new RegExp(`^${key}.+`, "i");
    expressions = Object.keys(attributes).filter((attr) => propRegExp.test(attr));

    extractExpressionFn = (accumulator, expression) => {
      const exprName = extractExpressionName(expression, key);
      if (exprName) {
        accumulator[exprName] = attributes[expression];
      }
      return accumulator;
    };
  } else {
    // Non-prefixed attributes (i.e., a regular HTML attribute)
    expressions = extractHtmlAttributes(attributes);

    extractExpressionFn = (accumulator, expression) => {
      // Get original attribute name from $attr not normalized by Angular (e.g., data-my-attr and not my-attr)
      const attrName = attributes.$attr[expression];

      // Handle attributes with no value. e.g., <button disabled></button>
      accumulator[attrName] =
        attributes[expression] === "" ? `${expression}` : attributes[expression];

      return accumulator;
    };
  }

  if (expressions.length === 0) {
    return null;
  }

  const expressionsMap = expressions.reduce(extractExpressionFn, baseExpressionMap);
  return expressionsMap;
}

export function getExpressions(attributes: ng.IAttributes) {
  return {
    props: extractExpressions("props", attributes),
    events: extractExpressions("on", attributes),
    attrs: extractExpressions("attrs", attributes),
  };
}
