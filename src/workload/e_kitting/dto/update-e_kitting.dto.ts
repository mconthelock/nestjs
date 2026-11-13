import { PartialType } from '@nestjs/swagger';
import { CreateEKittingDto } from './create-e_kitting.dto';

export class UpdateEKittingDto extends PartialType(CreateEKittingDto) {}
