import { PartialType } from '@nestjs/swagger';
import { CreateIsDevDto } from './create-is-dev.dto';

export class SearchIsDevDto extends PartialType(CreateIsDevDto) {}
