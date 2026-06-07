import { PartialType } from '@nestjs/swagger';
import { CreateIsOffDto } from './create-is-off.dto';

export class UpdateIsOffDto extends PartialType(CreateIsOffDto) {}
