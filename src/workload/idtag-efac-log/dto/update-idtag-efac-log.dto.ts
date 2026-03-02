import { PartialType } from '@nestjs/swagger';
import { CreateIdtagEfacLogDto } from './create-idtag-efac-log.dto';

export class UpdateIdtagEfacLogDto extends PartialType(CreateIdtagEfacLogDto) {}
