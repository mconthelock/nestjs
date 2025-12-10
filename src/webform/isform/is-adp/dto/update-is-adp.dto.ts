import { PartialType } from '@nestjs/swagger';
import { CreateIsAdpDto } from './create-is-adp.dto';

export class UpdateIsAdpDto extends PartialType(CreateIsAdpDto) {}
