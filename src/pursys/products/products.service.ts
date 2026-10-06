import {
    Injectable,
    ConflictException,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';

import { Products } from 'src/common/Entities/pursys/table/PRODUCTS.entity';
import { CategoriesService } from '../categories/categories.service';
import { OptionRegistryService } from './option-registry.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Products, 'purConnection')
        private prod: Repository<Products>,
        @InjectDataSource('purConnection')
        private ds: DataSource,
        private cate: CategoriesService,
        private optionRegistry: OptionRegistryService,
    ) {}

    async create(dto: CreateProductDto) {
        const attributes = dto.EXTRA_ATTRIBUTES ?? {};
        const requiredSchema = await this.cate.getInheritedAttributes(
            dto.CATEGORY_ID,
        );

        if (requiredSchema.length > 0) {
            for (const schema of requiredSchema) {
                const value = attributes[schema.name];

                // 1. เช็ค Require
                if (
                    schema.isRequired &&
                    (value === undefined || value === null || value === '')
                ) {
                    throw new BadRequestException(
                        `จำเป็นต้องระบุ Attribute: ${schema.name}`,
                    );
                }

                // ถ้าไม่มีค่าส่งมาและไม่ require ก็ข้ามไป
                if (value === undefined) continue;

                // 2. เช็ค Data Type
                if (schema.dataType === 'number' && isNaN(Number(value))) {
                    throw new BadRequestException(
                        `${schema.name} ต้องเป็นตัวเลขเท่านั้น`,
                    );
                }

                // 3. เช็ค Option แบบ FIXED
                if (
                    schema.dataType === 'option' &&
                    schema.optionSource === 'fixed'
                ) {
                    if (!schema.fixedOptions.includes(value)) {
                        throw new BadRequestException(
                            `ค่าของ ${schema.name} ต้องเป็นหนึ่งในนี้เท่านั้น: ${schema.fixedOptions.join(', ')}`,
                        );
                    }
                }

                // 4. เช็ค Option แบบ DATABASE (Dynamic Lookup)
                if (
                    schema.dataType === 'option' &&
                    schema.optionSource === 'database' &&
                    schema.referenceTable
                ) {
                    // ใช้ QueryBuilder วิ่งไปเช็คในตารางอ้างอิงจริงๆ ว่ามีค่านั้นอยู่ไหม (เช่น เช็ค id)
                    // *ต้องระวังเรื่อง SQL Injection หากอ้างอิงชื่อตารางตรงๆ ควรทำ Whitelist ของ referenceTable ไว้ครับ
                    const exists = await this.ds.query(
                        `SELECT 1 FROM ${schema.referenceTable} WHERE id = $1 LIMIT 1`,
                        [value],
                    );

                    if (exists.length === 0) {
                        throw new BadRequestException(
                            `ไม่พบข้อมูล ${value} ในระบบตาราง ${schema.referenceTable}`,
                        );
                    }
                }

                // 5. เช็ค Option แบบ FUNCTION
                if (
                    schema.dataType === 'option' &&
                    schema.optionSource === 'function' &&
                    schema.functionName
                ) {
                    const isValid = await this.optionRegistry.execute(
                        schema.functionName,
                        value,
                    );
                    if (!isValid) {
                        throw new BadRequestException(
                            `ค่าของ ${schema.name} ('${value}') ไม่ผ่านเงื่อนไข`,
                        );
                    }
                }
            }
        }

        const newProduct = this.prod.create({
            ...dto,
            EXTRA_ATTRIBUTES: attributes,
        });
        return await this.prod.save(newProduct);
    }

    async findAll(): Promise<Products[]> {
        return await this.prod.find();
    }

    async findOne(id: number): Promise<Products> {
        const product = await this.prod.findOne({
            where: { ID: id },
        });
        if (!product) {
            throw new NotFoundException(`ไม่พบสินค้าไอดี ${id}`);
        }
        return product;
    }

    async update(
        id: number,
        updateProductDto: UpdateProductDto,
    ): Promise<Products> {
        const product = await this.findOne(id); // เช็คว่ามีของไหมก่อน

        // ถ้ามีการเปลี่ยน SKU ต้องเช็คซ้ำด้วย
        if (
            updateProductDto.SPRODCODE &&
            updateProductDto.SPRODCODE !== product.SPRODCODE
        ) {
            const existingProduct = await this.prod.findOne({
                where: { SPRODCODE: updateProductDto.SPRODCODE },
            });
            if (existingProduct) {
                throw new ConflictException(
                    `รหัส SKU: ${updateProductDto.SPRODCODE} มีอยู่ในระบบแล้ว`,
                );
            }
        }

        Object.assign(product, updateProductDto);
        return await this.prod.save(product);
    }

    async remove(id: number): Promise<{ success: boolean }> {
        const product = await this.findOne(id);
        await this.prod.softRemove(product); // ทำ Soft Delete
        return { success: true };
    }
}
