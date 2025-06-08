import { PartialType } from '@nestjs/mapped-types';
import { CreateAppsmenuDto } from './create-appsmenu.dto';

export class UpdateAppsmenuDto extends PartialType(CreateAppsmenuDto) {}
