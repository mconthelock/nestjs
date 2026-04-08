import { PartialType } from '@nestjs/swagger';
import { CreateIsCfDto } from './create-is-cf.dto';

export class UpdateIsCfDto extends PartialType(CreateIsCfDto) {}
