import { PartialType } from '@nestjs/swagger';
import { CreateFormmstDto } from './create-formmst.dto';

export class UpdateFormmstDto extends PartialType(CreateFormmstDto) {}
