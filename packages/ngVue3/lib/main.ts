import angular from "angular";
import { ngVueComponentFactory } from "./angular/ngVueComponentFactory";

export { createVueComponent } from "./helpers/createVueComponent";

export const ngVue = angular
  .module("ngVue", [])
  .factory("createVueComponent", ngVueComponentFactory);
