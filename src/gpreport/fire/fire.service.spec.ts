import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import * as XLSX from 'xlsx';
import { FireService } from './fire.service';
import { FireController } from './fire.controller';
import { FireRepository } from './fire.repository';

describe('Fire screen API contracts', () => {
    let app: INestApplication;
    let service: FireService;
    const repository = {allItems: jest.fn(), findOne: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn()};
    beforeAll(async () => {
        const module = await Test.createTestingModule({controllers: [FireController], providers: [FireService, {provide: FireRepository, useValue: repository}]}).compile();
        service = module.get(FireService);
        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true, whitelist: true}));
        await app.init();
    });
    afterAll(() => app.close());
    beforeEach(() => jest.resetAllMocks());
    it('returns every master, including inactive records, without pagination truncation', async () => {
        repository.allItems.mockResolvedValue([{FIRE_CODE: '001', STATUS: '0'}]);
        await request(app.getHttpServer()).get('/fire/items').expect(200).expect({items: [{FIRE_CODE: '001', STATUS: '0'}]});
    });
    it('accepts multipart save, trims fields and retains codes with leading zeroes', async () => {
        repository.findOne.mockResolvedValue(null); repository.create.mockResolvedValue({FIRE_CODE: '001'});
        await request(app.getHttpServer()).post('/fire/save').field('FIRE_CODE', ' 001 ').field('LOCATION', ' A ').field('STATUS', '1').expect(201).expect({message: 'บันทึกข้อมูลแล้ว'});
        expect(repository.create).toHaveBeenCalledWith({FIRE_CODE: '001', LOCATION: 'A', FTYPE: '', CAPACITY: '', AREA: '', STATUS: '1'});
    });
    it('rejects duplicate inactive codes and never creates a second item', async () => {
        repository.findOne.mockResolvedValue({FIRE_CODE: '001', STATUS: '0'});
        await expect(service.saveItem({FIRE_CODE: '001', STATUS: '1'})).rejects.toThrow('FIRE_CODE_ALREADY_EXISTS');
        expect(repository.create).not.toHaveBeenCalled();
    });
    it('enforces Oracle byte limits, status, scalar inputs and immutable code', async () => {
        for (const data of [{FIRE_CODE: 'ก'.repeat(7), STATUS: '1'}, {FIRE_CODE: '001', LOCATION: 'ก'.repeat(34), STATUS: '1'}, {FIRE_CODE: '001', STATUS: '9'}, {FIRE_CODE: [], STATUS: '1'}, {FIRE_CODE: '002', original_code: '001', STATUS: '1'}]) {
            await expect(service.saveItem(data)).rejects.toThrow();
        }
        expect(repository.create).not.toHaveBeenCalled(); expect(repository.update).not.toHaveBeenCalled();
    });
    it('updates existing items and soft deletes without calling permanent delete', async () => {
        repository.update.mockResolvedValue({affected: 1}); repository.findOne.mockResolvedValue({FIRE_CODE: '001'});
        await service.saveItem({FIRE_CODE: '001', original_code: '001', STATUS: '1', LOCATION: 'B'});
        expect(repository.update).toHaveBeenCalledWith('001', {STATUS: '1', LOCATION: 'B', FTYPE: '', CAPACITY: '', AREA: ''});
        await request(app.getHttpServer()).post('/fire/deactivate').field('FIRE_CODE', '001').expect(201);
        expect(repository.update).toHaveBeenLastCalledWith('001', {STATUS: '0'});
        expect(repository.delete).not.toHaveBeenCalled();
    });
    it('returns report from multipart Excel using only active masters', async () => {
        repository.allItems.mockResolvedValue([{FIRE_CODE: '001'}]);
        const book = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet([['header'], [null, null, null, null, null, null, '11/10/2026', null, null, '(001)']]), 'One');
        const res = await request(app.getHttpServer()).post('/fire/inspection/check').field('month', '2026-11').attach('excel', XLSX.write(book, {type: 'buffer', bookType: 'biff8'}), 'รายงาน.xls').expect(201);
        expect(repository.allItems).toHaveBeenCalledWith(true);
        expect(res.body).toMatchObject({complete: true, filename: 'รายงาน.xls', matched_count: 1, missing: [], unexpected: []});
    });
    it('rejects missing uploads, invalid months and empty active master', async () => {
        await request(app.getHttpServer()).post('/fire/inspection/check').field('month', '2026-11').expect(422);
        await expect(service.checkInspection('2026-13', null)).rejects.toThrow();
        repository.allItems.mockResolvedValue([]);
        const book=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(book,XLSX.utils.aoa_to_sheet([['header']]),'One');
        await expect(service.checkInspection('2026-11', {buffer: XLSX.write(book,{type:'buffer',bookType:'xlsx'}), originalname:'report.xlsx',size:100} as any)).rejects.toThrow('ไม่พบข้อมูล Master');
    });
});
