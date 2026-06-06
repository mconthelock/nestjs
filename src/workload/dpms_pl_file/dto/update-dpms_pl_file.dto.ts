import { PartialType } from '@nestjs/swagger';
import { CreateDpmsPlFileDto } from './create-dpms_pl_file.dto';

export class UpdateDpmsPlFileDto extends PartialType(CreateDpmsPlFileDto) {}
