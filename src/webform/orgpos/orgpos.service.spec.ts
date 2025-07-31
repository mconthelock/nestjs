import { Test, TestingModule } from '@nestjs/testing';
import { OrgposService } from './orgpos.service';

describe('OrgposService', () => {
  let service: OrgposService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrgposService],
    }).compile();

    service = module.get<OrgposService>(OrgposService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
