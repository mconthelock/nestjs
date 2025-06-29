import { PartialType } from '@nestjs/swagger';
import { CreateWorkpicDto } from './create-workpic.dto';

export class UpdateWorkpicDto extends PartialType(CreateWorkpicDto) {}
