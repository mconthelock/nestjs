import { Controller } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SpecificationService } from './specification.service';

@ApiTags('Program Specification')
@Controller('spec')
export class SpecificationController {
  constructor(private readonly spec: SpecificationService) {}
}
