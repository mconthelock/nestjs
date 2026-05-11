import { PartialType } from '@nestjs/swagger';
import { CreateHandleFileFormDto } from './create-handle-file-form.dto';

export class UpdateHandleFileFormDto extends PartialType(CreateHandleFileFormDto) {}
