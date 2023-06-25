import { Factory } from './factory.abstract';

const factory = <T>(
  factory: new () => Factory<T>,
  overrides: Partial<T> = {},
): Factory<T> => {
  const factoryInstance = new factory();

  factoryInstance.overrides = overrides;

  return factoryInstance;
};

export default factory;
