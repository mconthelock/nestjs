import { PartialType } from '@nestjs/swagger';
import { ESCSCreateUserItemDto } from './create-user-item.dto';

export class ESCSUpdateUserItemDto extends PartialType(ESCSCreateUserItemDto) {}
