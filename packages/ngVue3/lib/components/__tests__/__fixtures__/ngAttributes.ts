/**
 * Normalize function lifted from angular 1.8.3
 * @param name
 * @returns
 */
function ngNormalize(name: string): string {
  const PREFIX_REGEXP = /^((?:x|data)[:\-_])/i;
  const SPECIAL_CHARS_REGEXP = /[:\-_]+(.)/g;

  return name
    .replace(PREFIX_REGEXP, "")
    .replace(SPECIAL_CHARS_REGEXP, function (_, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    });
}

/**
 * Contains a mix of regular HTML attributes, angular attributes, ngVue special
 * attributes, angular IAttribute properties/methods, and decoy attributes that
 * look like ngVue but aren't (ie., vDataBar)
 *
 * $attr in an IAttribute is a lookup for reversing the normalization of the
 * attributes done by angular, we use this for move HTML attributes to the vue
 * component.
 */
export const getNgAttributeObj = (): ng.IAttributes => ({
  foo: "ctrl.foo",
  ngIf: "ctrl.show",
  class: "my-class",
  disabled: "",
  ngClick: "ctrl.click",
  style: "font-size:3;",
  tabindex: "3",
  vDataBar: "ctrl.data",
  vDirectives: "ctrl.directives",
  vOnFooBar: "ctrl.bar",
  vOnHandleClick: "ctrl.handleClick.bind(ctrl, 'foo')",
  vProps: "{person: ctrl.person, people: ctrl.people}",
  vPropsFoo: "ctrl.foo",
  vPropsIsDisabled: "ctrl.disabled",
  watchDepth: "2",
  $normalize: ngNormalize,
  $addClass(classVal: string) {},
  $removeClass(classVal: string) {},
  $updateClass(newClasses: string, oldClasses: string) {},
  $set(key: string, value: any) {},
  $observe<T>(name: string, fn: (value?: T) => any) {
    return () => {};
  },
  $attr: {
    foo: "data-foo",
    ngIf: "ng-if",
    class: "class",
    disabled: "disabled",
    ngClick: "ng-click",
    style: "style",
    tabindex: "tabindex",
    vDataBar: "v-data-bar",
    vDirectives: "v-directives",
    vOnFooBar: "v-on-foo-bar",
    vOnHandleClick: "v-on-handle-click",
    vProps: "v-props",
    vPropsFoo: "v-props-foo",
    vPropsIsDisabled: "v-props-is-disabled",
    vWatchDepth: "v-watch-depth",
  },
});
