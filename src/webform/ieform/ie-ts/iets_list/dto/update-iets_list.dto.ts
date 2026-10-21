import { PartialType } from '@nestjs/swagger';
import { CreateIetsListDto } from './create-iets_list.dto';

export class UpdateIetsListDto extends PartialType(CreateIetsListDto) {}
