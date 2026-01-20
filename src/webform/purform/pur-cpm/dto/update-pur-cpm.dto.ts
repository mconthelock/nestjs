import { PartialType } from '@nestjs/swagger';
import { CreatePurCpmDto } from './create-pur-cpm.dto';

export class UpdatePurCpmDto extends PartialType(CreatePurCpmDto) {}
