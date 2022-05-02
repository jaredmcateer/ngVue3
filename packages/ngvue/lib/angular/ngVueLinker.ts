export function ngVueLinker(
  componentName: unknown,
  jqElement: JQLite,
  attrs: ng.IAttributes,
  scope: ng.IScope,
) {
  if (!jqElement.parent().length) {
    throw new Error("ngVue components must have a parent tag or they will not render");
  }

  
}
