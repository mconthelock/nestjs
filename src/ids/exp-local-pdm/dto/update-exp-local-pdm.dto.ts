import { PartialType } from '@nestjs/swagger';
import { CreateExpLocalPdmDto } from './create-exp-local-pdm.dto';

export class UpdateExpLocalPdmDto extends PartialType(CreateExpLocalPdmDto) {}
