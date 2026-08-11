import { PartialType } from '@nestjs/swagger';
import { CreateTurmcodeDto } from './create-turmcode.dto';

export class UpdateTurmcodeDto extends PartialType(CreateTurmcodeDto) {}
