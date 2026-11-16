import { Injectable } from '@nestjs/common';
import { CreateEKittingDto } from './dto/create-e_kitting.dto';
import { UpdateEKittingDto } from './dto/update-e_kitting.dto';
import { EKittingRepository } from './e_kitting.repository';

@Injectable()
export class EKittingService {
    constructor(private readonly eKittingRepository: EKittingRepository) {}

    search(order: string, packing: string) {
        return this.eKittingRepository.search(order, packing);
    }

    getMaster(item?: string){
        return this.eKittingRepository.getMaster(item);
    }

    saveMaster(dto: CreateEKittingDto) {
        return this.eKittingRepository.saveMaster(dto);
    }
    
    deleteMaster(item: string, DWG: string) {
        return this.eKittingRepository.deleteMaster(item, DWG);
    }
}
