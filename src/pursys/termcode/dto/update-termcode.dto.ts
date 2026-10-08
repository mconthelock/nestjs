import { PartialType } from '@nestjs/swagger';
import { CreateTermcodeDto } from './create-termcode.dto';

export class UpdateTermcodeDto extends PartialType(CreateTermcodeDto) {}
