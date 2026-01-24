import { Controller } from '@nestjs/common';
import { PartcategoryService } from './partcategory.service';

@Controller('partcategory')
export class PartcategoryController {
  constructor(private readonly partcategoryService: PartcategoryService) {}
}
