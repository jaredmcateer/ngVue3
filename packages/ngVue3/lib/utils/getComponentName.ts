/**
 * Tries to get the component name or infer it from the file path if possible,
 * failing those returns a generic name
 * @param component Component to get name for
 * @returns a name
 */
export function getComponentName(component: any) {
  let name = "AnonymousComponent";

  if (component.name) {
    name = component.name;
  } else if (component.__file) {
    name = parseFileName(component.__file) || name;
  }

  return name;
}

/**
 * Converts the file path to a component name if possible, this uses the same
 * regex as Vue 3 does
 * @see https://github.com/vuejs/core/blob/8dcb6c7bbdd2905469e2bb11dfff27b58cc784b2/packages/runtime-core/src/component.ts#L966
 *
 * @param path file path of component
 * @returns An empty string if path doesn't match or the CamelCased name of
 *          component inferred from path
 */
function parseFileName(path: string) {
  let name = "";
  const match = path.match(/([^/\\]+)\.\w+$/);
  if (match) {
    name = match[1].replace(/(?:^|[-_])(\w)/g, (c) => c.toUpperCase()).replace(/[-_]/g, "");
  }
  return name;
}
