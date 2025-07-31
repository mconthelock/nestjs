import { Test, TestingModule } from '@nestjs/testing';
import { OrgposController } from './orgpos.controller';
import { OrgposService } from './orgpos.service';

describe('OrgposController', () => {
  let controller: OrgposController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrgposController],
      providers: [OrgposService],
    }).compile();

    controller = module.get<OrgposController>(OrgposController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
