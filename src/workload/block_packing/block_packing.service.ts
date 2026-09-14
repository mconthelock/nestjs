import { Injectable } from '@nestjs/common';
import { CreateBlockPackingDto } from './dto/create-block_packing.dto';
import {
    UpdateBlockPackingDto,
    UpdateRemarkByOrderDto,
} from './dto/update-block_packing.dto';
import { SearchPackingDto } from './dto/search-packing.dto';
import { BlockPackingRepository } from './block_packing.repository';

@Injectable()
export class BlockPackingService {
    constructor(
        private readonly blockPackingRepository: BlockPackingRepository,
    ) {}

    async getTRNBarcode() {
        return this.blockPackingRepository.getTRNBarcode();
    }

    async getOrderMainCombine(order: string, block: string) {
        const carton = await this.blockPackingRepository.getDataCartonBox();
        const orderMainCombine =
            await this.blockPackingRepository.getOrderMainCombine(order, block);

        const result = orderMainCombine.map((main) => {
            const matchedCartons = carton.filter((c) => {
                const orderMatch =
                    String(main.S03K01).trim() === String(c.ORDER_NO).trim();
                const packingMatch =
                    String(main.S03K04).trim() === String(c.PACKING_NO).trim();
                return orderMatch && packingMatch;
            });

            return {
                ...main,
                cartons: matchedCartons, // array ของ carton ที่ตรงกับ order นี้
            };
        });

        return result;
    }

    async issuePISMFG(dto: SearchPackingDto) {
        const result = await this.blockPackingRepository.getPisPages(dto);
        return result;
    }

    async updateRemarkPacking(dto: UpdateBlockPackingDto) {
        const result =
            await this.blockPackingRepository.updateRemarkPacking(dto);
        return result;
    }
    async updateRemarkOrders(dto: UpdateRemarkByOrderDto) {
        const result =
            await this.blockPackingRepository.updateRemarkByOrder(dto);
        return result;
    }
}
