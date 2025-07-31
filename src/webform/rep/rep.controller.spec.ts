import { Test, TestingModule } from '@nestjs/testing';
import { RepController } from './rep.controller';
import { RepService } from './rep.service';

describe('RepController', () => {
  let controller: RepController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepController],
      providers: [RepService],
    }).compile();

    controller = module.get<RepController>(RepController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
