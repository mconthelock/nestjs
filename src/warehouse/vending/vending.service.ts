import { Injectable } from '@nestjs/common';
import { CreateVendingDto } from './dto/create-vending.dto';
import { UpdateVendingDto } from './dto/update-vending.dto';
import { AddToolsVendingDto } from './dto/addtools-vending.dto';
import { VendingRepository } from './vending.repository';

@Injectable()
export class VendingService {
    constructor(private readonly vendingrepo: VendingRepository) {}

    async getProduct() {
        try {
            return await this.vendingrepo.getProduct();
        } catch (error) {
            throw error;
        }
    }

    async addTools(dto: AddToolsVendingDto) {
        try {
            return await this.vendingrepo.addTools(dto);
        } catch (error) {
            throw error;
        }
    }
    
    async getTools() {
        try {
            return await this.vendingrepo.getTools();
        } catch (error) {
            throw error;
        }
    }
}
