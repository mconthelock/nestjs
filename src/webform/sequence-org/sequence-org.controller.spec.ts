import { Test, TestingModule } from '@nestjs/testing';
import { SequenceOrgController } from './sequence-org.controller';
import { SequenceOrgService } from './sequence-org.service';

describe('SequenceOrgController', () => {
  let controller: SequenceOrgController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SequenceOrgController],
      providers: [SequenceOrgService],
    }).compile();

    controller = module.get<SequenceOrgController>(SequenceOrgController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
