import { PartialType } from '@nestjs/swagger';
import { CreateIetsDto } from './create-ie-ts.dto';

export class UpdateIetsDto extends PartialType(CreateIetsDto) {}
