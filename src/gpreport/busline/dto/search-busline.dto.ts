import { PartialType } from '@nestjs/swagger';
import { UpdateBuslineDto } from './update-busline.dto';

export class SearchBuslineDto extends PartialType(UpdateBuslineDto) {}
