/**
 * Lowers the first character of the provided text. Note this function does not
 * handle locales as this is for HTML attribute names
 *
 * @param text
 * @returns The provided text with the first character lowered
 */
export function lowerFirst([first, ...rest]: string): string {
  return first.toLowerCase() + rest.join("");
}
