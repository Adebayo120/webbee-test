export abstract class Factory<T> {
  overrides: Partial<T> = {};
  abstract define(): T;

  make(): T {
    return { ...this.define(), ...this.overrides };
  }
}
