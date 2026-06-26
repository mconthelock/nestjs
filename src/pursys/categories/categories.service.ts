import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateAttributeDto } from './dto/create-category-attribute.dto';

import { Categories } from 'src/common/Entities/pursys/table/CATEGORIES.entity';
import { CategoryAttributes } from 'src/common/Entities/pursys/table/CATEGORY_ATTRIBUTES.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Categories, 'purConnection')
        private cate: Repository<Categories>,
        @InjectRepository(CategoryAttributes, 'purConnection')
        private attr: Repository<CategoryAttributes>,
    ) {}

    async create(createCategoryDto: CreateCategoryDto): Promise<Categories> {
        const category = new Categories();
        category.CATEGORY_NAME = createCategoryDto.CATEGORY_NAME;

        // ถ้ามีการส่ง parentId มาด้วย ให้ไปหาข้อมูลหมวดหมู่พ่อมาผูกไว้
        if (createCategoryDto.PARENT_ID) {
            const parent = await this.cate.findOne({
                where: { CATEGORY_ID: createCategoryDto.PARENT_ID },
            });
            if (!parent) {
                throw new NotFoundException('ไม่พบหมวดหมู่หลักที่ระบุ');
            }
            category.PARENT_ID = parent;
        }
        return await this.cate.save(category);
    }

    // ดึงหมวดหมู่ทั้งหมดออกมาเป็นโครงสร้างต้นไม้ (Nested Object) จบในฟังก์ชันเดียว
    async findTree(): Promise<Categories[]> {
        const categories = await this.cate.find({
            relations: ['PARENT_ID'],
            order: { CATEGORY_ID: 'ASC' },
        });

        const categoryMap = new Map<number, Categories>();
        for (const category of categories) {
            category.CHILDREN = [];
            categoryMap.set(category.CATEGORY_ID, category);
        }

        const roots: Categories[] = [];
        for (const category of categories) {
            const parentId = category.PARENT_ID?.CATEGORY_ID;
            if (!parentId) {
                roots.push(category);
                continue;
            }

            const parent = categoryMap.get(parentId);
            if (parent) {
                parent.CHILDREN.push(category);
            } else {
                roots.push(category);
            }
        }

        return roots;
    }

    async findOne(id: string): Promise<Categories> {
        const category = await this.cate.findOne({
            where: { CATEGORY_ID: parseInt(id) },
        });
        if (!category) {
            throw new NotFoundException(`ไม่พบหมวดหมู่ไอดี ${id}`);
        }
        return category;
    }

    async getInheritedAttributes(categoryId: number) {
        let category = await this.cate.findOne({
            where: { CATEGORY_ID: categoryId },
            relations: ['attributes', 'PARENT_ID'],
        });
        if (!category) throw new NotFoundException('ไม่พบหมวดหมู่');

        // 1. ดึงสายตระกูลทั้งหมด (Ancestors) จากตัวมันเองย้อนขึ้นไปหา Root
        const ancestors: Categories[] = [];
        while (category) {
            ancestors.unshift(category);

            const parentId = category.PARENT_ID?.CATEGORY_ID;
            if (!parentId) {
                break;
            }

            category = await this.cate.findOne({
                where: { CATEGORY_ID: parentId },
                relations: ['attributes', 'PARENT_ID'],
            });
        }

        // 2. รวบรวม Attribute ทั้งหมดเข้าด้วยกัน
        const allAttributes = [];
        for (const ancestor of ancestors) {
            if (ancestor.attributes && ancestor.attributes.length > 0) {
                allAttributes.push(...ancestor.attributes);
            }
        }

        // อาจจะทำแบบเอาตัวซ้ำออก (Remove duplicates by name) เผื่อมีการ override ในหมวดหมู่ย่อย
        const uniqueAttributes = Array.from(
            new Map(allAttributes.map((attr) => [attr.name, attr])).values(),
        );

        return uniqueAttributes;
    }

    // ➕ 1. เพิ่ม Attribute ใหม่ให้ Category
    async addAttribute(
        categoryId: number,
        dto: CreateAttributeDto,
    ): Promise<CategoryAttributes> {
        const category = await this.cate.findOne({
            where: { CATEGORY_ID: categoryId },
        });
        if (!category)
            throw new NotFoundException(`ไม่พบหมวดหมู่รหัส ${categoryId}`);

        // ตรวจสอบว่าชื่อ Attribute ซ้ำในหมวดหมู่นี้หรือไม่
        const existingAttr = await this.attr.findOne({
            where: {
                category: { CATEGORY_ID: categoryId },
                ATTNAME: dto.ATTNAME,
            },
        });
        if (existingAttr)
            throw new BadRequestException(
                `หมวดหมู่นี้มี Attribute ชื่อ '${dto.ATTNAME}' อยู่แล้ว`,
            );

        const fixedOptions = dto.FIXED_OPTIONS
            ? JSON.stringify(dto.FIXED_OPTIONS)
            : undefined;

        const newAttribute = this.attr.create({
            ...dto,
            FIXED_OPTIONS: fixedOptions,
            category, // ผูกกับ Category
        });

        return await this.attr.save(newAttribute);
    }

    // 🔍 2. ดึง Attribute ทั้งหมดของ Category นี้ (ไม่รวมที่สืบทอดมา)
    async getAttributesByCategory(
        categoryId: number,
    ): Promise<CategoryAttributes[]> {
        return await this.attr.find({
            where: { category: { CATEGORY_ID: categoryId } },
        });
    }

    // 🗑️ 3. ลบ Attribute
    async removeAttribute(attributeId: number): Promise<{ success: boolean }> {
        const attribute = await this.attr.findOne({
            where: { ID: attributeId },
        });
        if (!attribute)
            throw new NotFoundException('ไม่พบ Attribute ที่ต้องการลบ');

        await this.attr.remove(attribute);
        return { success: true };
    }
}
