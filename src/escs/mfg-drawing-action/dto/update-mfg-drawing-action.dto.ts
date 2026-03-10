import { PartialType } from '@nestjs/swagger';
import { CreateMfgDrawingActionDto } from './create-mfg-drawing-action.dto';

export class UpdateMfgDrawingActionDto extends PartialType(CreateMfgDrawingActionDto) {}
