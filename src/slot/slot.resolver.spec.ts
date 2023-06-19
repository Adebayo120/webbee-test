import { Test, TestingModule } from '@nestjs/testing';
import { SlotResolver } from './slot.resolver';

describe('SlotResolver', () => {
  let resolver: SlotResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlotResolver],
    }).compile();

    resolver = module.get<SlotResolver>(SlotResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
