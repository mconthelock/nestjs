import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { CategoriesService } from '../categories/categories.service';
import { OptionRegistryService } from './option-registry.service';
import { Products } from 'src/common/Entities/pursys/table/PRODUCTS.entity';

describe('ProductsService - Dynamic Attributes Validation', () => {
    let service: ProductsService;
    let categoriesService: CategoriesService;
    let optionRegistry: OptionRegistryService;

    // 1. Mock TypeORM Repository
    const mockProductRepository = {
        create: jest.fn().mockImplementation((dto) => dto),
        save: jest
            .fn()
            .mockImplementation((product) =>
                Promise.resolve({ ID: 1, ...product }),
            ),
    };

    // 2. Mock Categories Service (เพื่อจำลอง Attribute Schema ที่สืบทอดมา)
    const mockCategoriesService = {
        getInheritedAttributes: jest.fn(),
    };

    // 3. Mock Option Registry Service (สำหรับตรวจสอบ Option แบบ Function)
    const mockOptionRegistry = {
        execute: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide: getRepositoryToken(Products, 'purConnection'),
                    useValue: mockProductRepository,
                },
                {
                    provide: getDataSourceToken('purConnection'),
                    useValue: { query: jest.fn() },
                },
                { provide: CategoriesService, useValue: mockCategoriesService },
                {
                    provide: OptionRegistryService,
                    useValue: mockOptionRegistry,
                },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        categoriesService = module.get<CategoriesService>(CategoriesService);
        optionRegistry = module.get<OptionRegistryService>(
            OptionRegistryService,
        );

        // กำหนด Schema จำลองสำหรับ "คอมพิวเตอร์ Desktop" ไว้เป็นค่าเริ่มต้น
        mockCategoriesService.getInheritedAttributes.mockResolvedValue([
            {
                name: 'brand',
                dataType: 'text',
                isRequired: true,
                optionSource: 'none',
            },
            {
                name: 'ram_gb',
                dataType: 'number',
                isRequired: true,
                optionSource: 'none',
            },
            {
                name: 'case_color',
                dataType: 'option',
                isRequired: true,
                optionSource: 'fixed',
                fixedOptions: ['Black', 'White'],
            },
            {
                name: 'supplier',
                dataType: 'option',
                isRequired: true,
                optionSource: 'function',
                functionName: 'checkSupplier',
            },
        ]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('ควรสร้างสินค้าได้สำเร็จ เมื่อส่งข้อมูล Attributes ครบและถูกต้อง', async () => {
        // จำลองให้ Function Registry คืนค่าว่า "ผ่าน" (true)
        mockOptionRegistry.execute.mockResolvedValueOnce(true);

        const dto = {
            SKU: 'PC-001',
            NAME: 'Desktop PC',
            CATEGORY_ID: 1,
            EXTRA_ATTRIBUTES: {
                brand: 'Dell',
                ram_gb: 16,
                case_color: 'Black',
                supplier: 'SUP-999',
            },
        };

        const result: any = await service.create(dto);

        expect(result.SKU).toBe('PC-001');
        expect(result.EXTRA_ATTRIBUTES.brand).toBe('Dell');
        expect(mockProductRepository.save).toHaveBeenCalled();
        expect(mockOptionRegistry.execute).toHaveBeenCalledWith(
            'checkSupplier',
            'SUP-999',
        );
    });

    it('ควรแจ้งเตือน (BadRequest) เมื่อไม่ส่ง Attribute ที่เป็นฟิลด์บังคับ (isRequired)', async () => {
        const dto = {
            SKU: 'PC-002',
            NAME: 'Desktop PC',
            CATEGORY_ID: 10,
            EXTRA_ATTRIBUTES: {
                brand: 'Dell',
                // ตั้งใจลบ ram_gb, case_color, และ supplier ออก
            },
        };

        await expect(service.create(dto)).rejects.toThrow(BadRequestException);
        await expect(service.create(dto)).rejects.toThrow(
            'จำเป็นต้องระบุ Attribute: ram_gb',
        );
    });

    it('ควรแจ้งเตือน (BadRequest) เมื่อส่งข้อมูลผิดประเภท (เช่น ส่งตัวอักษรเข้าฟิลด์ Number)', async () => {
        const dto = {
            SKU: 'PC-003',
            NAME: 'Desktop PC',
            CATEGORY_ID: 10,
            EXTRA_ATTRIBUTES: {
                brand: 'Dell',
                ram_gb: 'Sixteen', // ส่ง String แทน Number
                case_color: 'Black',
                supplier: 'SUP-999',
            },
        };

        await expect(service.create(dto)).rejects.toThrow(BadRequestException);
        await expect(service.create(dto)).rejects.toThrow(
            'ram_gb ต้องเป็นตัวเลขเท่านั้น',
        );
    });

    it('ควรแจ้งเตือน (BadRequest) เมื่อเลือก Option แบบ Fixed ไม่ตรงกับค่าที่กำหนดไว้', async () => {
        const dto = {
            SKU: 'PC-004',
            NAME: 'Desktop PC',
            CATEGORY_ID: 10,
            EXTRA_ATTRIBUTES: {
                brand: 'Dell',
                ram_gb: 16,
                case_color: 'Pink', // สีนี้ไม่มีใน ['Black', 'White']
                supplier: 'SUP-999',
            },
        };

        await expect(service.create(dto)).rejects.toThrow(BadRequestException);
        await expect(service.create(dto)).rejects.toThrow(
            /ต้องเป็นหนึ่งในนี้เท่านั้น/,
        );
    });

    it('ควรแจ้งเตือน (BadRequest) เมื่อ Option แบบ Function ตรวจสอบแล้วไม่ผ่าน', async () => {
        // จำลองให้ Function Registry คืนค่าว่า "ไม่ผ่าน" (false) เช่น หาซัพพลายเออร์ไม่เจอ
        mockOptionRegistry.execute.mockResolvedValueOnce(false);

        const dto = {
            SKU: 'PC-005',
            NAME: 'Desktop PC',
            CATEGORY_ID: 10,
            EXTRA_ATTRIBUTES: {
                brand: 'Dell',
                ram_gb: 16,
                case_color: 'White',
                supplier: 'INVALID-SUP',
            },
        };

        await expect(service.create(dto)).rejects.toThrow(BadRequestException);
        await expect(service.create(dto)).rejects.toThrow(
            "ค่าของ supplier ('INVALID-SUP') ไม่ผ่านเงื่อนไข",
        );
    });
});
