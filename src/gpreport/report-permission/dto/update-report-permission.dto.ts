import { PartialType } from '@nestjs/swagger';
import { CreateReportPermissionDto } from './create-report-permission.dto';

export class UpdateReportPermissionDto extends PartialType(
    CreateReportPermissionDto,
) {}
