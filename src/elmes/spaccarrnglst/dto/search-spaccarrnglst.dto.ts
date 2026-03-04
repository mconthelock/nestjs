import { PartialType } from '@nestjs/swagger';
import { CreateSpaccarrnglstDto } from './create-spaccarrnglst.dto';

export class SearchSpaccarrnglstDto extends PartialType(
  CreateSpaccarrnglstDto,
) {}
