import { PartialType } from '@nestjs/swagger';
import { CreateMfgSerialDto } from './create-mfg-serial.dto';

export class UpdateMfgSerialDto extends PartialType(CreateMfgSerialDto) {}
