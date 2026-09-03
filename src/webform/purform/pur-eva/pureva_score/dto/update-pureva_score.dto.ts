import { PartialType } from '@nestjs/swagger';
import { CreatePurevaScoreDto } from './create-pureva_score.dto';

export class UpdatePurevaScoreDto extends PartialType(CreatePurevaScoreDto) {}
