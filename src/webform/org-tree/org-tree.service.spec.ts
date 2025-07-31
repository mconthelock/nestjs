import { Test, TestingModule } from '@nestjs/testing';
import { OrgTreeService } from './org-tree.service';

describe('OrgTreeService', () => {
  let service: OrgTreeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrgTreeService],
    }).compile();

    service = module.get<OrgTreeService>(OrgTreeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
