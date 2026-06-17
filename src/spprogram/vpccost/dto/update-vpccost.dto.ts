import { PartialType } from '@nestjs/swagger';
import { CreateVpccostDto } from './create-vpccost.dto';

export class UpdateVpccostDto extends PartialType(CreateVpccostDto) {}
