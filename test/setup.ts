import { TestManager } from './helpers/test-manager.helper';

global.beforeAll(() => {
  global.testManager = new TestManager();
});

global.afterAll(async () => {
  await global.testManager.afterAll();
});
