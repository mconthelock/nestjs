import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { SearchVendorDto } from './dto/search-vendor.dto';

import { Vendors } from 'src/common/Entities/pursys/table/VENDORS.entity';

@Injectable()
export class VendorsService {
    constructor(
        @InjectRepository(Vendors, 'purConnection')
        private readonly vnd: Repository<Vendors>,
    ) {}

    async search(q?: SearchVendorDto) {
        const qb = this.vnd
            .createQueryBuilder('vnd')
            .leftJoinAndSelect('vnd.PURVMM', 'history')
            .leftJoinAndSelect('history.FORM', 'form')
            .leftJoinAndSelect('history.ADDRESSES', 'addr')
            .leftJoinAndSelect('form.flow', 'flow');
        if (q) await applyDynamicFilters(qb, q, 'vnd');
        return qb.getMany();
    }

    async create(dto: CreateVendorDto) {
        const nextVendorCode = await this.nextVendor(
            dto.VENDGROUP,
            dto.VENDPURPOSE,
        );
        dto = { ...dto, VND_CODE: nextVendorCode, CREATE_AT: new Date() };
        delete dto.VENDGROUP;
        delete dto.VENDPURPOSE;
        const vendor = this.vnd.create(dto);
        return this.vnd.save(vendor);
    }

    async update(vndCode: string, dto: UpdateVendorDto) {
        const vendor = await this.vnd.findOne({ where: { VND_CODE: vndCode } });
        if (!vendor) {
            throw new NotFoundException(
                `Vendor with code ${vndCode} not found`,
            );
        }
        Object.assign(vendor, dto);
        return this.vnd.save(vendor);
    }

    async nextVendor(first: number, second?: number) {
        let minCode: number;
        let maxCode: number;
        if (first == 6) {
            minCode = parseInt(`${first}${second ? second : '0'}000`);
            maxCode = parseInt(`${first}${second ? second : '8'}999`);
        } else {
            minCode = parseInt(`${first}${first == 8 ? '0' : second}000`);
            maxCode = parseInt(`${first}${first == 8 ? '9' : second}999`);
        }
        const vendors = await this.vnd.find();
        const nextVendor = vendors
            .filter(
                (v) =>
                    parseInt(v.VND_CODE) >= minCode &&
                    parseInt(v.VND_CODE) <= maxCode,
            )
            .sort((a, b) => parseInt(a.VND_CODE) - parseInt(b.VND_CODE))
            .pop();
        const nextVendorCode = nextVendor
            ? (parseInt(nextVendor.VND_CODE) + 1).toString()
            : minCode.toString();
        return nextVendorCode;
    }
}
