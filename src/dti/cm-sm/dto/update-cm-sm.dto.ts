import { PartialType } from '@nestjs/swagger';
import { CreateCmSmDto } from './create-cm-sm.dto';

export class UpdateCmSmDto extends PartialType(CreateCmSmDto) {}
