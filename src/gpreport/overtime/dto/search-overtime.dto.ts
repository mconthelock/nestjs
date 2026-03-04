import { PartialType } from '@nestjs/swagger';
import { UpdateOvertimeDto } from './update-overtime.dto';


export class SearchOvertimeDto extends PartialType(UpdateOvertimeDto) {}
