import { PartialType } from '@nestjs/swagger';
import { CreatePurevaProfitTurnoverDto } from './create-pureva_profit_turnover.dto';

export class UpdatePurevaProfitTurnoverDto extends PartialType(CreatePurevaProfitTurnoverDto) {}
