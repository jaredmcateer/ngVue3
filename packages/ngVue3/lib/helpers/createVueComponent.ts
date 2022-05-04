import { ngVueComponentDirective } from "../angular/ngVueComponentFactory";

type NgDirectiveTuple<T extends string = string> = [
  T,
  ["createVueComponent", (createVueComponent: typeof ngVueComponentDirective) => ng.IDirective]
];
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
export function createVueComponent<N extends string, T extends unknown>(
  name: N,
  Component: T,
  ngDirectiveConfig?: ng.IDirective
): NgDirectiveTuple<N> {
  return [
    name,
    [
      "createVueComponent",
      (createVueComponent: typeof ngVueComponentDirective) =>
        createVueComponent(name, Component, ngDirectiveConfig),
    ],
  ];
}
