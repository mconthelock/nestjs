import { Injectable } from '@nestjs/common';
import { CreateVpDto } from './dto/create-vp.dto';
import { UpdateVpDto } from './dto/update-vp.dto';
import { VpsRepository } from './vps.repository';

@Injectable()
export class VpsService {
    constructor(private readonly vpsRepository: VpsRepository) {}

    async chkPrint(order: string, packing: string): Promise<boolean> {
        return await this.vpsRepository.chkPrint(order, packing);
    }

    async getDetailPIS(packing: string): Promise<any[]> {
        return await this.vpsRepository.getDetailPIS(packing);
    }
}
