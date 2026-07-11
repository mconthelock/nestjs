import { PartialType } from '@nestjs/swagger';
import { CreatePcurrencyDto } from './create-pcurrency.dto';

export class UpdatePcurrencyDto extends PartialType(CreatePcurrencyDto) {}
