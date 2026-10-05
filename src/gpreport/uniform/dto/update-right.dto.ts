import { PartialType } from '@nestjs/swagger';
import { CreateUniformRightDto } from './create-right.dto';

export class UpdateUniformRightDto extends PartialType(CreateUniformRightDto) {}
