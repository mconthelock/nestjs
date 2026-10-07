import { PartialType } from '@nestjs/swagger';
import { CreateIsCboDto } from './create-is-cbo.dto';

export class UpdateIsCboDto extends PartialType(CreateIsCboDto) {}
