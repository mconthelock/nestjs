import { Injectable } from '@nestjs/common';
import { IsTidService } from './is-tid.service';
import { CreateIsTidFormDto } from './dto/create-is-tid.dto';

@Injectable()
export class IsTidCreateFormService {
    constructor(private readonly isTidService: IsTidService) {}

    private readonly deleteStep = [
        {
            CSTEPNO: '19'
        }
    ]

    async create(dto: CreateIsTidFormDto) {
        try {
            console.log( dto);
            
        } catch (error) {
            throw new Error(
                'Create Production Environment ID temporary use request Failed: ' +
                    error.message,
            );
        }
    }
}
