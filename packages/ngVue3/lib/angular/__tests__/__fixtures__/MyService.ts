import { InjectionKey } from "vue";

// Injection key used by ngVueProvider test and button component
export const MyServiceKey: InjectionKey<(val: number) => number> = Symbol();

export class MyService {
  private props: Record<string, any> = {
    make: "Kerluke",
    colour: "gray",
    isAvailable: true,
    quantity: 80,
  };

  getProp(key: any) {
    return this.props[key];
  }
}
