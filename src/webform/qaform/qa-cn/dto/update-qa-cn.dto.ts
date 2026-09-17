import { PartialType } from '@nestjs/swagger';
import { CreateQaCnDto } from './create-qa-cn.dto';

export class UpdateQaCnDto extends PartialType(CreateQaCnDto) {}
