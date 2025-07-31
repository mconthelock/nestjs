import { Test, TestingModule } from '@nestjs/testing';
import { SequenceOrgService } from './sequence-org.service';

describe('SequenceOrgService', () => {
  let service: SequenceOrgService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SequenceOrgService],
    }).compile();

    service = module.get<SequenceOrgService>(SequenceOrgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
