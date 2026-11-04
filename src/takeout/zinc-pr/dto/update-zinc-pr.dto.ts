import { PartialType } from '@nestjs/swagger';
import { CreateZincPrDto } from './create-zinc-pr.dto';

export class UpdateZincPrDto extends PartialType(CreateZincPrDto) {}
