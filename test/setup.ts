import { TestManager } from './test-manager';

global.beforeEach(() => {
  global.testManager = new TestManager();
});

global.afterEach(async () => {
  await global.testManager.afterEach();
});
