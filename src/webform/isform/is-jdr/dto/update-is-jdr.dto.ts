import { PartialType } from '@nestjs/swagger';
import { CreateIsJdrDto } from './create-is-jdr.dto';

export class UpdateIsJdrDto extends PartialType(CreateIsJdrDto) {}
