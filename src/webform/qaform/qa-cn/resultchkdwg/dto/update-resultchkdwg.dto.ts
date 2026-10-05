import { PartialType } from '@nestjs/swagger';
import { CreateResultchkdwgDto } from './create-resultchkdwg.dto';

export class UpdateResultchkdwgDto extends PartialType(CreateResultchkdwgDto) {}
