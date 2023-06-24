import { Factory } from './factory.abstract';

const factory = <T>(
  factory: new () => Factory<T>,
  overides: Partial<T> = {},
): Factory<T> => {
  const factoryInstance = new factory();

  factoryInstance.overides = overides;

  return factoryInstance;
};

export default factory;
