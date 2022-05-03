import { ngVueComponentDirective } from "../angular/ngVueComponentFactory";

/**
 * Reduces boilerplate of creating vue components
 *
 * @example
 * angular
 *   .module(...)
 *   .directive(...createVueComponent('my-component', Component))
 *
 * Is the equivalent to
 *
 * angular
 *   .module(...)
 *   .directive(
 *     'my-component',
 *     [
 *       'createVueComponent',
 *       (createVueComponent) => createVueComponent(
 *         'my-component',
 *         Component
 *       )
 *     ]
 *   )
 *
 * @param name Name of ng directive
 * @param Component Vue Component
 * @param ngDirectiveConfig extends the default angular directive
 * @returns array to be used in directive declaration
 */
export function createVueComponent(
  name: string,
  Component: unknown,
  ngDirectiveConfig?: ng.IDirective
) {
  return [
    name,
    [
      "createVueComponent",
      (createVueComponent: typeof ngVueComponentDirective) =>
        createVueComponent(name, Component, ngDirectiveConfig),
    ],
  ];
}
