import { Factory } from './factory.abstract';

const factory = <T>(factory: new () => Factory<T>): Factory<T> => {
  return new factory();
};

export default factory;
