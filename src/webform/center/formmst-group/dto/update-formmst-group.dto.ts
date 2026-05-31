import { PartialType } from '@nestjs/swagger';
import { CreateFormmstGroupDto } from './create-formmst-group.dto';

export class UpdateFormmstGroupDto extends PartialType(CreateFormmstGroupDto) {}
