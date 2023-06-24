export abstract class Factory<T> {
  overides: Partial<T> = {};
  abstract define(): T;

  make(): T {
    return { ...this.define(), ...this.overides };
  }
}
