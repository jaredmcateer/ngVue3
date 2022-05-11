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
