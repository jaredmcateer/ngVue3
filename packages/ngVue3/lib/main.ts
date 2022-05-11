import angular from "angular";
import { ngVueComponentFactory } from "./angular/ngVueComponentFactory";

let ngVueModule: ng.IModule;

export { ngVueComponent } from "./helpers/ngVueComponent";
export { useNgVuePlugins } from "./angular/ngVueProvider";

export function useNgVue() {
  if (!ngVueModule) {
    ngVueModule = angular.module("ngVue", []).factory("createVueComponent", ngVueComponentFactory);
  }
  return ngVueModule.name;
}
