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


describe('Fire Phase 3 area persistence', () => {
    const { FireCheckHeadService } = require('./fire-check-head.service');
    let service: any;
    let head: any;
    let details: any[];
    let repo: any;
    let detailRepo: any;
    const payload = () => ({NFRMNO:12, VORGNO:'000101', CYEAR:'26', CYEAR2:'2026', NRUNNO:1, AREA:'A', FMONTH:'11', FYEAR:'2026', items:[
        {FIRE_CODE:'D', GAGE:'OK', WEIGHT:null, PIN:'OK', HOSE:'OK', CLEAN:'OK', DETAIL:null, CHECK_DATE:'2026-11-10'},
        {FIRE_CODE:'E', GAGE:'OK', WEIGHT:null, PIN:'OK', HOSE:'OK', CLEAN:'OK', DETAIL:null, CHECK_DATE:'2026-11-10'},
    ]});
    beforeEach(() => {
        head = null; details = [];
        repo = {
            checkTransactionActive: () => false,
            findInspectionHead: jest.fn(async () => head),
            createCheckHead: jest.fn(async data => {head = data; return data;}),
            withCheckTransaction: jest.fn(async work => {try {return await work();} catch (error) {head = null; details = []; throw error;}}),
        };
        detailRepo = {createCheckDetails: jest.fn(async rows => {details = rows;})};
        service = new FireCheckHeadService(repo, detailRepo, {allItems:async () => ['D','E'].map(FIRE_CODE => ({FIRE_CODE, AREA:'A', FTYPE:'Dry', CAPACITY:'10 lb'}))});
    });
    it('inserts one head and details numbered from 1 in one transaction', async () => {
        const result = await service.createInspection(payload());
        expect(result.data.status).toBe('CREATED');
        expect(repo.withCheckTransaction).toHaveBeenCalledTimes(1);
        expect(details.map(item => item.ID)).toEqual([1,2]);
        expect(details[0].CHECK_DATE).toBeInstanceOf(Date);
        expect(details[0].NRUNNO).toBe(head.NRUNNO);
    });
    it('skips an existing area/month/year without inserting', async () => {
        head = {AREA:'A', FMONTH:'11', FYEAR:'2026'};
        expect((await service.createInspection(payload())).data.status).toBe('SKIP');
        expect(repo.createCheckHead).not.toHaveBeenCalled();
    });
    it('rejects missing, extra, duplicate and wrong-month details before persistence', async () => {
        const variants = [payload(), payload(), payload(), payload()];
        variants[0].items.pop(); variants[1].items[0].FIRE_CODE = 'EXTRA'; variants[2].items[1].FIRE_CODE = 'D'; variants[3].items[0].CHECK_DATE = '2026-10-10';
        for (const input of variants) await expect(service.createInspection(input)).rejects.toThrow();
        expect(repo.createCheckHead).not.toHaveBeenCalled();
    });
    it('rolls back head and details together when detail persistence fails', async () => {
        detailRepo.createCheckDetails.mockRejectedValue(new Error('database failure'));
        await expect(service.createInspection(payload())).rejects.toThrow('FIRE_INSPECTION_SAVE_ROLLED_BACK');
        expect(head).toBeNull(); expect(details).toEqual([]);
    });
    it('rechecks inside the transaction and skips a concurrent winner', async () => {
        repo.findInspectionHead.mockResolvedValueOnce(null).mockResolvedValueOnce({AREA:'A', NRUNNO:99});
        expect((await service.createInspection(payload())).data.status).toBe('SKIP');
        expect(repo.createCheckHead).not.toHaveBeenCalled();
    });
    it('rejects invalid nested data and byte overflow without creating a head', async () => {
        const invalid = payload(); invalid.items[0].GAGE = 'x'.repeat(21);
        await expect(service.createInspection(invalid)).rejects.toThrow('FIRE_INSPECTION_INVALID_DATA');
        const byteOverflow = payload(); byteOverflow.items[0].PIN = '\u0e01'.repeat(7);
        await expect(service.createInspection(byteOverflow)).rejects.toThrow('FIRE_INSPECTION_INVALID_DATA');
        expect(repo.createCheckHead).not.toHaveBeenCalled();
    });
    it('exposes the aggregate route and generates DETAIL.ID on the server', async () => {
        const {FireCheckHeadController} = require('./fire-check-head.controller');
        const module = await Test.createTestingModule({controllers:[FireCheckHeadController], providers:[{provide:FireCheckHeadService, useValue:service}]}).compile();
        const api = module.createNestApplication();
        api.useGlobalPipes(new ValidationPipe({transform:true, whitelist:true}));
        await api.init();
        try {
            const res = await request(api.getHttpServer()).post('/fire/check-heads/inspection').send(payload()).expect(201);
            expect(res.body.data.status).toBe('CREATED');
            expect(details.map(item => item.ID)).toEqual([1,2]);
        } finally {await api.close();}
    });

    it('does not claim rollback when the commit response is uncertain', async () => {
        repo.withCheckTransaction.mockImplementation(async work => {await work(); throw new Error('commit response lost');});
        await expect(service.createInspection(payload())).rejects.toThrow('FIRE_INSPECTION_SAVE_UNCONFIRMED');
    });

});
