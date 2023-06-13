import angular from "angular";
import { App, Directive, InjectionKey, Plugin, Component } from "vue";

export type PluginHook = ($injector: ng.auto.IInjectorService, app: App<Element>) => void;

export interface NgVuePlugin {
  /** Plugin name */
  $name: string;
  /** Plugin install function */
  $plugin: PluginHook;
  /** Methods/properties to expose on the angular side as part of the ngVueProvider.plugins.<$name>.<$config.key> */
  $config: Record<string, unknown>;
}

export type NgVueInjectable = [key: string | InjectionKey<unknown>, value: unknown];
export type NgVueHookCallback = (hook: PluginHook) => void;

export interface NgVueService {
  initNgVuePlugins(app: App<Element>): void;
  getInjectables(): NgVueInjectable[];
  getVuePlugins(): Plugin[];
  getVueDirectives(): Record<string, Directive>;
  getVueComponents(): Record<string, Component>;
}

export class NgVueProvider {
  $get: ["$injector", ($injector: ng.auto.IInjectorService) => NgVueService];
  static readonly $inject = ["$injector"];

  private pluginHooks: PluginHook[] = [];
  private pluginConfig: Record<string, any> = {};
  private injectables: NgVueInjectable[] = [];
  private nativeVuePlugins: Plugin[] = [];
  private nativeVueDirectives: Record<string, Directive> = {};
  private nativeVueComponents: Record<string, Component> = {};

  constructor(private $injector: ng.auto.IInjectorService) {
    this.$get = [
      "$injector",
      ($injector: ng.auto.IInjectorService): NgVueService => {
        const initNgVuePlugins = (app: App<Element>) => {
          const callback: NgVueHookCallback = (hook) => {
            hook($injector, app);
          };

          this.callHooks(this.pluginHooks, callback);
        };

        return {
          initNgVuePlugins,
          getInjectables: () => this.injectables,
          getVuePlugins: () => this.nativeVuePlugins,
          getVueDirectives: () => this.nativeVueDirectives,
          getVueComponents: () => this.nativeVueComponents,
        };
      },
    ];
  }

  get plugins() {
    return this.pluginConfig;
  }

  /**
   * Acts as a pass through to the Vue app instance for providing an injectable.
   * @param name A string or symbol that can be used to inject into a component
   * @param value
   */
  provide(name: string, value: unknown): void;
  provide<IKey = unknown>(name: InjectionKey<IKey>, value: unknown): void;
  provide<IKey = unknown>(name: string | InjectionKey<IKey>, value: unknown) {
    this.injectables.push([name, value]);
  }

  /**
   * Acts as a pass through for native Vue plugins to the app instance. If
   * access to angular is needed by the plugin use `installNgVuePlugin`
   * @param vuePlugin Native Vue plugin
   */
  use(vuePlugin: Plugin) {
    this.nativeVuePlugins.push(vuePlugin);
  }

  /**
   * Acts as a pass through for native vue directives to the app instance.
   * @param vueDirective
   */
  directive(name: string, vueDirective: Directive) {
    this.nativeVueDirectives[name] = vueDirective;
  }

  /**
   * Acts as a pass through for native vue components to the app instance.
   * @param vueComponent
   */
  component(name: string, vueComponent: Component) {
    this.nativeVueComponents[name] = vueComponent;
  }

  /**
   * Installs an ngVue plugin, this gives access to configuration via the
   * ngVueProvider and gives the Vue plugin install method access to the angular
   * injector.
   *
   * @param plugin a function that returns a ngVue plugin config
   */
  installNgVuePlugin(plugin: () => NgVuePlugin) {
    const { $name, $config, $plugin } = plugin();
    this.pluginHooks.push($plugin);
    this.pluginConfig[$name] = $config;
  }

  private callHooks(hooks: PluginHook[], callback: NgVueHookCallback) {
    if (hooks) {
      hooks.forEach((hook) => callback(hook));
    }
  }
}

let ngVuePluginsModule: ng.IModule;

export function useNgVuePlugins() {
  if (!ngVuePluginsModule) {
    ngVuePluginsModule = angular.module("ngVue.plugins", []).provider("$ngVue", [
      "$injector",
      function ($injector: ng.auto.IInjectorService) {
        return new NgVueProvider($injector);
      },
    ]);
  }

  return ngVuePluginsModule.name;
}
