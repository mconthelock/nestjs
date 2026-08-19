import { PartialType } from '@nestjs/swagger';
import { CreatePurTrackingDto } from './create-purtracking.dto';

export class UpdatePurTrackingDto extends PartialType(CreatePurTrackingDto) {
    
}

