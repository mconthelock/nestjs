import { PartialType } from '@nestjs/swagger';
import { ESCSCreateUserFileDto } from './create-user-file.dto';

export class ESCSUpdateUserFileDto extends PartialType(ESCSCreateUserFileDto) {}
