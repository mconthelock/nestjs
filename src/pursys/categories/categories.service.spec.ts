import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { Categories } from 'src/common/Entities/pursys/table/CATEGORIES.entity';

describe('CategoriesService - Nested Creation', () => {
    let service: CategoriesService;

    // 1. จำลอง (Mock) การทำงานของ TypeORM Repository
    const mockCategoryRepository = {
        findOne: jest.fn(),
        save: jest.fn(),
    };

    beforeEach(async () => {
        // 2. ตั้งค่า Testing Module
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoriesService,
                {
                    provide: getRepositoryToken(Categories, 'purConnection'),
                    useValue: mockCategoryRepository,
                },
            ],
        }).compile();

        service = module.get<CategoriesService>(CategoriesService);
    });

    afterEach(() => {
        // ล้างค่า Mock ทุกครั้งที่จบแต่ละ Test Case
        jest.clearAllMocks();
    });

    it('ควรสร้างหมวดหมู่ อุปกรณ์อิเล็กทรอนิก > คอมพิวเตอร์ > คอมพิวเตอร์ desktop ตามลำดับได้', async () => {
        // ==========================================
        // ขั้นที่ 1: สร้าง Root Category (อุปกรณ์อิเล็กทรอนิก)
        // ==========================================
        const rootCategory = {
            CATEGORY_ID: 1,
            CATEGORY_NAME: 'อุปกรณ์อิเล็กทรอนิก',
            PARENT_ID: undefined,
        };

        // ตั้งค่าให้เมื่อเรียก save() ครั้งแรก ให้คืนค่า Root กลับมา
        mockCategoryRepository.save.mockResolvedValueOnce(rootCategory);

        const createdRoot = await service.create({
            CATEGORY_NAME: 'อุปกรณ์อิเล็กทรอนิก',
        });

        expect(createdRoot.CATEGORY_NAME).toBe('อุปกรณ์อิเล็กทรอนิก');
        expect(createdRoot.PARENT_ID).toBeUndefined();

        // ==========================================
        // ขั้นที่ 2: สร้าง Level 1 (คอมพิวเตอร์) ให้อยู่ใต้ Root
        // ==========================================
        const level1Category = {
            CATEGORY_ID: 2,
            CATEGORY_NAME: 'คอมพิวเตอร์',
            PARENT_ID: rootCategory,
        };

        // ตั้งค่าให้หา Root (Parent) เจอ
        mockCategoryRepository.findOne.mockResolvedValueOnce(rootCategory);
        // ตั้งค่าให้ save() ครั้งที่สอง คืนค่า Level 1 กลับมา
        mockCategoryRepository.save.mockResolvedValueOnce(level1Category);

        const createdLevel1 = await service.create({
            CATEGORY_NAME: 'คอมพิวเตอร์',
            PARENT_ID: createdRoot.CATEGORY_ID,
        });

        expect(createdLevel1.CATEGORY_NAME).toBe('คอมพิวเตอร์');
        expect(createdLevel1.PARENT_ID.CATEGORY_ID).toBe(
            createdRoot.CATEGORY_ID,
        );

        // ==========================================
        // ขั้นที่ 3: สร้าง Level 2 (คอมพิวเตอร์ desktop) ให้อยู่ใต้ Level 1
        // ==========================================
        const level2Category = {
            CATEGORY_ID: 3,
            CATEGORY_NAME: 'คอมพิวเตอร์ desktop',
            PARENT_ID: level1Category,
        };

        // ตั้งค่าให้หา Level 1 (Parent) เจอ
        mockCategoryRepository.findOne.mockResolvedValueOnce(level1Category);
        // ตั้งค่าให้ save() ครั้งที่สาม คืนค่า Level 2 กลับมา
        mockCategoryRepository.save.mockResolvedValueOnce(level2Category);

        const createdLevel2 = await service.create({
            CATEGORY_NAME: 'คอมพิวเตอร์ desktop',
            PARENT_ID: createdLevel1.CATEGORY_ID,
        });

        expect(createdLevel2.CATEGORY_NAME).toBe('คอมพิวเตอร์ desktop');
        expect(createdLevel2.PARENT_ID.CATEGORY_ID).toBe(
            createdLevel1.CATEGORY_ID,
        );

        // ==========================================
        // ตรวจสอบความถูกต้องของการเรียกใช้ Repository
        // ==========================================
        // ฟังก์ชัน save ต้องถูกเรียกไปทั้งหมด 3 ครั้งพอดี
        expect(mockCategoryRepository.save).toHaveBeenCalledTimes(3);
        // ฟังก์ชัน findOne ต้องถูกเรียกไป 2 ครั้ง (ตอนหา Parent ให้ Level 1 และ Level 2)
        expect(mockCategoryRepository.findOne).toHaveBeenCalledTimes(2);
    });

    it('ควรแจ้งเตือน NotFoundException ถ้าส่ง parentId ที่ไม่มีอยู่จริงมา', async () => {
        // จำลองเคสที่หา Parent ไม่เจอใน Database
        mockCategoryRepository.findOne.mockResolvedValueOnce(null);

        // คาดหวังว่า Service ต้องพ่น Error ออกมา
        await expect(
            service.create({ CATEGORY_NAME: 'จอภาพ', PARENT_ID: 999 }),
        ).rejects.toThrow(NotFoundException);
    });
});
