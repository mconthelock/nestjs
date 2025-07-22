import { Test, TestingModule } from '@nestjs/testing';
import { QaTypeService } from './qa_type.service';

describe('QaTypeService', () => {
  let service: QaTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QaTypeService],
    }).compile();

    service = module.get<QaTypeService>(QaTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
