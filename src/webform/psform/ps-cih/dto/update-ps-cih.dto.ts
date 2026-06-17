import { PartialType } from '@nestjs/swagger';
import { GetDataFormDto } from './create-ps-cih.dto';

export class UpdatePsCihDto extends PartialType(GetDataFormDto) {}
