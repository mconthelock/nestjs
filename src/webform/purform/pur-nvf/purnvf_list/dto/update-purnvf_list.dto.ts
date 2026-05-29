import { PartialType } from '@nestjs/swagger';
import { CreatePurnvfListDto } from './create-purnvf_list.dto';

export class UpdatePurnvfListDto extends PartialType(CreatePurnvfListDto) {}
