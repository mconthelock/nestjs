import { PartialType } from '@nestjs/swagger';
import { CreateItemMfgTypeDto } from './create-item-mfg-type.dto';

export class UpdateItemMfgTypeDto extends PartialType(CreateItemMfgTypeDto) {}
