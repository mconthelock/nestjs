import { PartialType } from '@nestjs/swagger';
import { CreateSecpicDto } from './create-secpic.dto';

export class UpdateSecpicDto extends PartialType(CreateSecpicDto) {}
