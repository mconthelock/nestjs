import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateJigDto } from './create-jig.dto';

// Only fields persisted in the form snapshot; no master lifecycle or audit fields.
export class JigSnapshotDto extends OmitType(CreateJigDto, [
    'JIG_NO',
] as const) {}

export class PatchJigSnapshotDto extends PartialType(JigSnapshotDto, {
    skipNullProperties: false,
}) {}
