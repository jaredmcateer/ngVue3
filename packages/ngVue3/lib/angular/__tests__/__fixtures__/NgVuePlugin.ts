import angular from "angular";
import { Plugin, reactive } from "vue";
import { NgVueProvider, useNgVuePlugins } from "../../ngVueProvider";
import { MyService } from "./MyService";
export const CustomNgVuePluginName = "customNgVuePlugin";
const propStore: Record<string, any> = reactive({});
const keyStore: string[] = [];

function registerKeys(keys: string[]) {
  keyStore.push(...keys);
}
function registerProperties(properties: Record<string, any>) {
  Object.entries(properties).forEach(([key, value]) => {
    propStore[key] = value;
  });
}

export interface CustomNgVuePluginConfig {
  register: typeof registerKeys;
  [key: string]: any;
}

const CustomVuePlugin: Plugin = {
  install(app, options) {
    app.provide(CustomNgVuePluginName, propStore);
  },
};

let ngVueModule: ng.IModule;
export function useCustomNgVuePlugin() {
  if (!ngVueModule) {
    ngVueModule = angular.module(useNgVuePlugins()).config([
      "$ngVueProvider",
      ($ngVuProvider: NgVueProvider) => {
        $ngVuProvider.installNgVuePlugin(() => ({
          $name: CustomNgVuePluginName,
          $config: { register: registerKeys } as CustomNgVuePluginConfig,
          $plugin: ($injector, app) => {
            const myService = $injector.get<MyService>("myService");
            const props = keyStore.reduce((accumulator, key) => {
              accumulator[key] = myService.getProp(key);
              return accumulator;
            }, {} as Record<string, unknown>);
            registerProperties(props);
            app.use(CustomVuePlugin);
          },
        }));
      },
    ]);
  }
  return ngVueModule.name;
}
