import { PartialType } from '@nestjs/swagger';
import { CreatePtermcodeDto } from './create-ptermcode.dto';

export class UpdatePtermcodeDto extends PartialType(CreatePtermcodeDto) {}
