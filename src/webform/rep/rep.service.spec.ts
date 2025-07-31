import { Test, TestingModule } from '@nestjs/testing';
import { RepService } from './rep.service';

describe('RepService', () => {
  let service: RepService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepService],
    }).compile();

    service = module.get<RepService>(RepService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
