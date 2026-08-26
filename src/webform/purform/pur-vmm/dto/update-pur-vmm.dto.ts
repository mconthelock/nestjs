import { PartialType } from '@nestjs/swagger';
import { CreatePurVmmDto } from './create-pur-vmm.dto';

export class UpdatePurVmmDto extends PartialType(CreatePurVmmDto) {}
