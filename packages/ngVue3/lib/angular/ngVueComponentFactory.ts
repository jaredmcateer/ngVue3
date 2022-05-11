import angular from "angular";
import { ngVueLinker } from "./ngVueLinker";

export type NgVueComponentDirective = (
  component: unknown,
  ngDirectiveConfig?: ng.IDirective
) => ng.IDirective;

/**
 * @example
 * angular.module('my.vue.components')
 *   .directive(...createVueComponent('HelloComponent', {
 *     props: {
 *       firstName: String,
 *       lastName: String,
 *     },
 *     emits: ['update-name'],
 *     setup(props, context) {
 *       const updateName = () => emit('update-name', 'Barb');
 *
 *       return () => (
 *         <h1>{props.firstName} {props.lastName}</h1>
 *         <button v-on:click={updateName}>Click me</button>
 *       );
 *     }
 *   }))
 *
 * @example
 * <hello-component
 *   v-props="ctrl.person"
 *   v-on-update-name="ctrl.nameUpdated"
 * ></hello-component>
 *
 * @example
 * <hello-component
 *   v-props-first-name="ctrl.person.firstName"
 *   v-props-last-name="ctrl.person.lastName"
 *   v-on-update-name="ctrl.nameUpdated"
 * ></hello-component>
 *
 * @param $injector
 * @returns A function when called returns a directive config
 */
export function ngVueComponentFactory(
  $injector: ng.auto.IInjectorService
): NgVueComponentDirective {
  return (component: unknown, ngDirectiveConfig?: ng.IDirective): ng.IDirective => {
    const config: ng.IDirective = {
      restrict: "E",
      link(scope: ng.IScope, elem: JQLite, attrs: ng.IAttributes) {
        ngVueLinker(component, elem, attrs, scope, $injector);
      },
    };

    return angular.extend(config, ngDirectiveConfig);
  };
}
ngVueComponentFactory.$inject = ["$injector"];
