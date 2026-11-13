import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GPLY01_TAX } from 'src/common/Entities/webform/table/GPLY01_TAX.entiry';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { TaxRepository } from './tax.repository';
import { TaxService } from './tax.service';

describe('TaxService.findHistory', () => {
    const qb = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
    };
    let service: TaxService;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module = await Test.createTestingModule({
            providers: [
                TaxService,
                {
                    provide: getRepositoryToken(GPLY01_TAX, 'webformConnection'),
                    useValue: { createQueryBuilder: jest.fn().mockReturnValue(qb) },
                },
                { provide: TaxRepository, useValue: {} },
                { provide: FormCreateService, useValue: {} },
            ],
        }).compile();
        service = module.get(TaxService);
    });

    it('treats null and blank names as no deduction', async () => {
        const records = [
            {
                FAMSNA: null,
                TAXEMF: null,
                TAXEMM: null,
                TAXSFT: null,
                TAXSPM: null,
                C1IED: null,
                C1NED: null,
                C2IED: null,
                C2NED: null,
            },
            {
                FAMSNA: '   ',
                TAXEMF: ' ',
                TAXEMM: '',
                TAXSFT: '  ',
                TAXSPM: '',
                C1IED: 0,
                C1NED: 0,
                C2IED: 0,
                C2NED: 0,
            },
        ];
        qb.getMany.mockResolvedValue(records);

        const result = await service.findHistory({});

        expect(result).toEqual(
            records.map((record) => ({
                ...record,
                TAX1: 60000,
                TAX2: 0,
                TAX3: 0,
                TAX4: 0,
            })),
        );
    });

    it('calculates deductions for populated names and child counts', async () => {
        const record = {
            FAMSNA: ' Spouse ',
            TAXEMF: ' Father ',
            TAXEMM: null,
            TAXSFT: '  ',
            TAXSPM: 'Parent',
            C1IED: 1,
            C1NED: 2,
            C2IED: 1,
            C2NED: 0,
        };
        qb.getMany.mockResolvedValue([record]);

        await expect(service.findHistory({})).resolves.toEqual([
            {
                ...record,
                TAX1: 60000,
                TAX2: 60000,
                TAX3: 150000,
                TAX4: 60000,
            },
        ]);
    });
});
