import angular from "angular";
import { extend } from "angular";
import { App, Plugin } from "vue";
import { globalStore } from "../globalStore";

export enum VueLifeCycleHooks {
  "onMounted",
  "onUpdated",
  "onUnmounted",
  "onBeforeMount",
  "onBeforeUpdate",
  "onBeforeUnmount",
  "onErrorCaptured",
  "onRenderTracked",
  "onRenderTriggered",
  "onActivated",
  "onDeactivated",
  "onServerPrefect",
}

export type PluginHook = ($injector: ng.auto.IInjectorService, app: App<Element>) => void;
export interface NgVuePlugin {
  /** Plugin name */
  $name: string;
  /** Plugin init function */
  $plugin: { init: PluginHook };
  /** Methods/properties to expose on the angular side as part of the ngVueProvider.<$name>.<$config.key> */
  $config: Record<string, unknown>;
  /** Vue lifecycle hooks  */
  $vue: Record<VueLifeCycleHooks, PluginHook>;
}

export type NgVueHookCallback = (hook: PluginHook) => void;
export interface NgVueService {
  initAppInstance(app: App<Element>): void;
  getGlobalProperties(): [key: string, value: unknown][];
  getVuePlugins(): Plugin[];
}

export class NgVueProvider {
  $get: (
    | "$injector"
    | (($injector: ng.auto.IInjectorService) => { initAppInstance: (app: App<Element>) => void })
  )[];
  static readonly $inject = ["$injector"];

  private pluginHooks: Record<"init", PluginHook[]> = Object.create(null);
  private vueHooks: Record<VueLifeCycleHooks, PluginHook[]> = Object.create(null);
  private globalProperties: [key: string, value: unknown][] = [];
  private vuePlugins: Plugin[] = [];

  constructor(private $injector: ng.auto.IInjectorService) {
    this.$get = [
      "$injector",
      ($injector: ng.auto.IInjectorService): NgVueService => {
        const initAppInstance = (app: App<Element>) => {
          const callback: NgVueHookCallback = (hook) => {
            hook($injector, app);
          };

          this.callHooks(this.pluginHooks, "init", callback);
          Object.assign(globalStore.globalProperties, this.createVueHooksMap(callback));
        };

        return {
          initAppInstance,
          getGlobalProperties: () => this.globalProperties,
          getVuePlugins: () => this.vuePlugins,
        };
      },
    ];
  }

  setGlobalProperty(key: string, value: unknown) {
    this.globalProperties.push([key, value]);
  }

  use(vuePlugin: Plugin) {
    this.vuePlugins.push(vuePlugin);
  }

  installNgVuePlugin(plugin: ($injector: ng.auto.IInjectorService) => NgVuePlugin) {
    const { $name, $config, $plugin, $vue } = plugin(this.$injector);
    this.addHooks(this.pluginHooks, $plugin);
    this.addHooks(this.vueHooks, $vue);
    angular.extend(this, { [$name]: $config });
  }

  private createVueHooksMap(callback: NgVueHookCallback) {
    return Object.keys(this.vueHooks).reduce(
      (accumulator, name) => ({
        ...accumulator,
        [name]: () => {
          this.callHooks(this.vueHooks, name, callback);
        },
      }),
      {}
    );
  }

  private addHooks(map: Record<string, PluginHook[]>, hooks: Record<string, PluginHook>) {
    if (hooks) {
      Object.entries(hooks).forEach(([key, hook]) => {
        map[key] = map[key] ?? [];
        map[key].push(hook);
      });
    }
  }

  private callHooks(map: Record<string, PluginHook[]>, key: string, callback: NgVueHookCallback) {
    const hooks = map[key];
    if (hooks) {
      hooks.forEach((hook) => callback(hook));
    }
  }
}
