export abstract class Factory<T> {
  abstract define(): T;

  make(): T {
    return this.define();
  }
}
