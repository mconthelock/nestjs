import { PartialType } from '@nestjs/mapped-types';
import { CreateIdtagPagesDto } from './create-idtag-pages.dto';

export class UpadateIdtagPagesDto extends PartialType(CreateIdtagPagesDto) {}
