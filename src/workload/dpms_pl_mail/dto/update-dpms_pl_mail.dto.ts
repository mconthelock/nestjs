import { PartialType } from '@nestjs/swagger';
import { CreateDpmsPlMailDto } from './create-dpms_pl_mail.dto';

export class UpdateDpmsPlMailDto extends PartialType(CreateDpmsPlMailDto) {}
