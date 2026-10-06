import { PartialType } from '@nestjs/swagger';
import { CreateGpTphReqDto } from './create-gp-tph.dto';

export class UpdateGpTphDto extends PartialType(CreateGpTphReqDto) {}
