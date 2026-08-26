import { PartialType } from '@nestjs/swagger';
import { CreatePsYicDto } from './create-ps-yic.dto';

export class UpdatePsYicDto extends PartialType(CreatePsYicDto) {}
