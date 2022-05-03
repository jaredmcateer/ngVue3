import { lowerFirst } from "../utils/lowerFirst";

const replacementMap = {
  vProps: "",
  vOn: "on",
} as const;
Object.freeze(replacementMap);

export function extractExpressionName(
  expression: string,
  replaceKey: keyof typeof replacementMap
): string | null {
  const pattern = new RegExp(`^${replaceKey}`, "i");

  if (!pattern.test(expression)) return null;

  const name = expression.replace(pattern, replacementMap[replaceKey]);
  return lowerFirst(name);
}
