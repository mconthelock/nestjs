import { IntersectionType, PartialType, PickType } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateESCSARRDto } from "./create-audit_report_revision.dto";

export class SearchESCSARRDto extends IntersectionType(
    PartialType(CreateESCSARRDto),
    PickType(CreateESCSARRDto, [
        'ARR_REV',
        'ARR_REV_TEXT',
        'ARR_INCHARGE',
    ]),
) {
}
