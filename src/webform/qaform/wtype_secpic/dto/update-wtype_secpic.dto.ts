import { PartialType } from '@nestjs/swagger';
import { CreateWtypeSecpicDto } from './create-wtype_secpic.dto';

export class UpdateWtypeSecpicDto extends PartialType(CreateWtypeSecpicDto) {}
