import { PartialType } from '@nestjs/swagger';
import { CreatePappflowDto } from './create-pappflow.dto';

export class UpdatePappflowDto extends PartialType(CreatePappflowDto) {}
