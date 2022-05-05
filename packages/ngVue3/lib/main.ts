import angular from "angular";
import { ngVueComponentFactory } from "./angular/ngVueComponentFactory";

const ngVue = "ngVue";
angular.module(ngVue, []).factory("createVueComponent", ngVueComponentFactory);

export { ngVueComponent } from "./helpers/ngVueComponent";

export function useNgVue() {
  return ngVue;
}
