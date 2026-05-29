import { PartialType } from '@nestjs/swagger';
import { CreateDpmsPackingListDto } from './create-dpms_packing_list.dto';

export class UpdateDpmsPackingListDto extends PartialType(CreateDpmsPackingListDto) {}
