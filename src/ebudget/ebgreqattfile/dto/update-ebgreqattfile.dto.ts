import { PartialType } from '@nestjs/swagger';
import { CreateEbgreqattfileDto } from './create-ebgreqattfile.dto';
import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdateEbgreqattfileDto extends PartialType(
  CreateEbgreqattfileDto,
) {
  @IsNotEmpty()
  @IsArray()
  condition: Partial<CreateEbgreqattfileDto>;
}
