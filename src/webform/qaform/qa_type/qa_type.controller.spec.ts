import { Test, TestingModule } from '@nestjs/testing';
import { QaTypeController } from './qa_type.controller';
import { QaTypeService } from './qa_type.service';

describe('QaTypeController', () => {
  let controller: QaTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QaTypeController],
      providers: [QaTypeService],
    }).compile();

    controller = module.get<QaTypeController>(QaTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
