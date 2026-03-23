import { PartialType } from '@nestjs/swagger';
import { CreateBrcurrencyDto } from './create-brcurrency.dto';

export class UpdateBrcurrencyDto extends PartialType(CreateBrcurrencyDto) {}
