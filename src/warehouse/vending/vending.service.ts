import { Injectable } from '@nestjs/common';
import { CreateVendingDto } from './dto/create-vending.dto';
import { UpdateVendingDto } from './dto/update-vending.dto';
import { AddToolsVendingDto } from './dto/addtools-vending.dto';
import { VendingRepository } from './vending.repository';
import { CreateImportDto } from './dto/import-vending.dto';

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

    async importVending(dto: CreateImportDto) {
        console.log('importVending dto:', dto);
        try {
            return await this.vendingrepo.importVending(dto);
        } catch (error) {
            throw error;
        }
    }

    async importHistory() {
        try {
            return await this.vendingrepo.importHistory();
        } catch (error) {
            throw error;
        }
    }

    async getImportDetail(importId: number) {
        try {
            return await this.vendingrepo.getImportDetail(importId);
        } catch (error) {
            throw error;
        }
    }

    async deleteImport(importId: number) {
        try {
            return await this.vendingrepo.deleteImport(importId);
        } catch (error) {
            throw error;
        }
    }
}
