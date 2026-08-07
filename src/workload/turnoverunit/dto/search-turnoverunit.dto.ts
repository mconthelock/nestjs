import { PartialType } from '@nestjs/swagger';
import { CreateTurnoverunitDto } from './create-turnoverunit.dto';

export class SearchTurnoverunitDto extends PartialType(CreateTurnoverunitDto) {}
