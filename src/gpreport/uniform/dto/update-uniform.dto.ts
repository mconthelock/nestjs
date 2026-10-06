import { PartialType } from '@nestjs/swagger';
import { CreateUniformDto } from './create-uniform.dto';

export class UpdateUniformDto extends PartialType(CreateUniformDto) {}
