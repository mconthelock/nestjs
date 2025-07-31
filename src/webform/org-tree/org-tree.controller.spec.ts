import { Test, TestingModule } from '@nestjs/testing';
import { OrgTreeController } from './org-tree.controller';
import { OrgTreeService } from './org-tree.service';

describe('OrgTreeController', () => {
  let controller: OrgTreeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrgTreeController],
      providers: [OrgTreeService],
    }).compile();

    controller = module.get<OrgTreeController>(OrgTreeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
