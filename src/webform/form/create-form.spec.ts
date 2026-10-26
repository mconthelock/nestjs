import { FlowmstRepository } from '../flowmst/flowmst.repository';
import { OrgTreeRepository } from '../org-tree/org-tree.repository';
import { FormCreateService } from './create-form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { formDetailQb, formatFormDetail } from 'src/common/utils/qb-form-detail';

describe('webform/createForm Database-Agnostic (Pure TypeORM & TypeScript)', () => {
    describe('FlowmstRepository.getFlowMaster', () => {
        it('should correctly traverse steps in linked-list execution order across any database', async () => {
            const mockSteps = [
                { NFRMNO: 1, VORGNO: '050601', CYEAR: '24', CSTEPNO: '03', CSTEPNEXTNO: '02', CSTART: '0' },
                { NFRMNO: 1, VORGNO: '050601', CYEAR: '24', CSTEPNO: '06', CSTEPNEXTNO: '05', CSTART: '1' },
                { NFRMNO: 1, VORGNO: '050601', CYEAR: '24', CSTEPNO: '05', CSTEPNEXTNO: '04', CSTART: '0' },
                { NFRMNO: 1, VORGNO: '050601', CYEAR: '24', CSTEPNO: '04', CSTEPNEXTNO: '03', CSTART: '0' },
            ];

            const mockDs: any = {
                manager: {
                    getRepository: jest.fn().mockReturnValue({
                        find: jest.fn().mockResolvedValue(mockSteps),
                    }),
                },
            };
            const repo = new FlowmstRepository(mockDs);

            const result = await repo.getFlowMaster(1, '050601', '24');
            expect(result).toHaveLength(4);
            expect(result.map((s) => s.CSTEPNO)).toEqual(['06', '05', '04', '03']);
        });

        it('should return empty array if no steps found', async () => {
            const mockDs: any = {
                manager: {
                    getRepository: jest.fn().mockReturnValue({
                        find: jest.fn().mockResolvedValue([]),
                    }),
                },
            };
            const repo = new FlowmstRepository(mockDs);
            const result = await repo.getFlowMaster(99, '000000', '99');
            expect(result).toEqual([]);
        });
    });

    describe('OrgTreeRepository.getOrgTree', () => {
        it('should traverse ancestor orgs and manager chain with pure TypeORM methods', async () => {
            const mockOrgTreeFindOne = jest.fn()
                .mockResolvedValueOnce({ VORGNO: '050602', VPARENT: '050601' })
                .mockResolvedValueOnce({ VORGNO: '050601', VPARENT: '050101' })
                .mockResolvedValueOnce({ VORGNO: '050101', VPARENT: '020101' })
                .mockResolvedValueOnce({ VORGNO: '020101', VPARENT: '00000' });

            const mockSeqFindOne = jest.fn()
                .mockResolvedValueOnce({ EMPNO: '95021', SPOSCODE: '41', HEADNO: '94038', SPOSCODE1: '30' })
                .mockResolvedValueOnce({ EMPNO: '94038', SPOSCODE: '30', HEADNO: '94046', SPOSCODE1: '11' })
                .mockResolvedValueOnce(null);

            const mockOrgPosFind = jest.fn().mockResolvedValue([
                { VORGNO: '050601', VPOSNO: '30', VEMPNO: '94038' },
            ]);

            const mockDs: any = {
                manager: {
                    getRepository: jest.fn().mockImplementation((entity) => {
                        const name = entity?.name || '';
                        if (name === 'ORGTREE') return { findOne: mockOrgTreeFindOne };
                        if (name === 'SEQUENCEORG') return { findOne: mockSeqFindOne };
                        if (name === 'ORGPOS') return { find: mockOrgPosFind };
                        return {};
                    }),
                },
            };
            const repo = new OrgTreeRepository(mockDs);

            const result = await repo.getOrgTree('050602', '30', '95021', '41');
            expect(mockOrgPosFind).toHaveBeenCalledTimes(1);
            expect(result).toEqual([{ VORGNO: '050601', VPOSNO: '30', VEMPNO: '94038' }]);
        });
    });

    describe('FormCreateService.setFormNo', () => {
        it('should convert NRUNNO string from DECIMAL to number without string concatenation', async () => {
            const mockRepo: any = {
                getFormNextRunNo: jest.fn().mockResolvedValue([{ NRUNNO: '5' }]),
            };
            const service = new FormCreateService(
                {} as any,
                {} as any,
                {} as any,
                {} as any,
                {} as any,
                mockRepo,
                {} as any,
                {} as any,
                {} as any,
                {} as any,
                {} as any,
                {} as any,
                {} as any,
            );

            const context: any = { query: {} };
            await service.setFormNo(context);
            expect(context.nrunno).toBe(6);
            expect(typeof context.nrunno).toBe('number');
        });
    });

    describe('FormCreateService.setFormValue', () => {
        const createServiceWithMockFormmst = (vname = 'Default Form Name') => {
            const mockFormmstService: any = {
                getFormmst: jest.fn().mockResolvedValue([
                    {
                        VFORMPAGE: '/form/test/index.asp',
                        VNAME: vname,
                    },
                ]),
            };
            return new FormCreateService(
                {} as any,
                {} as any,
                {} as any,
                mockFormmstService,
                {} as any,
                {} as any,
                {} as any,
                {} as any,
                {} as any,
                {} as any,
                {} as any,
                {} as any,
                {} as any,
            );
        };

        it('should use VTITLE from context when provided', async () => {
            const service = createServiceWithMockFormmst('Default Form Name');
            const context: any = {
                nfrmno: 1,
                vorgno: '050601',
                cyear: '25',
                cyear2: '2025',
                nrunno: 1,
                empno: '12069',
                inputempno: '12069',
                remark: 'test',
                ip: '127.0.0.1',
                vtitle: 'Custom Form Title',
            };

            const res = await service.setFormValue(context);
            expect(res.VTITLE).toBe('Custom Form Title');
        });

        it('should fallback to FORMMST.VNAME when VTITLE is not provided or empty', async () => {
            const service = createServiceWithMockFormmst('Master Form Name');
            const context: any = {
                nfrmno: 1,
                vorgno: '050601',
                cyear: '25',
                cyear2: '2025',
                nrunno: 1,
                empno: '12069',
                inputempno: '12069',
                remark: 'test',
                ip: '127.0.0.1',
                vtitle: '   ',
            };

            const res = await service.setFormValue(context);
            expect(res.VTITLE).toBe('Master Form Name');
        });

        it('should fallback to FORMMST.VNAME when VTITLE is undefined in create()', async () => {
            const service = createServiceWithMockFormmst('Master Form Name');
            const context: any = {
                nfrmno: 1,
                vorgno: '050601',
                cyear: '25',
                cyear2: '2025',
                nrunno: 1,
                empno: '12069',
                inputempno: '12069',
                remark: 'test',
                ip: '127.0.0.1',
            };

            const res = await service.setFormValue(context);
            expect(res.VTITLE).toBe('Master Form Name');
        });
    });

    describe('CreateFormDto Validation (VTITLE)', () => {
        it('should pass validation with or without VTITLE', async () => {
            const withTitle = plainToInstance(CreateFormDto, {
                NFRMNO: 1,
                VORGNO: '050601',
                CYEAR: '25',
                REQBY: '12069',
                INPUTBY: '12069',
                VTITLE: 'Request Special Budget',
            });
            const withoutTitle = plainToInstance(CreateFormDto, {
                NFRMNO: 1,
                VORGNO: '050601',
                CYEAR: '25',
                REQBY: '12069',
                INPUTBY: '12069',
            });

            expect(await validate(withTitle)).toHaveLength(0);
            expect(await validate(withoutTitle)).toHaveLength(0);
            expect(withTitle.VTITLE).toBe('Request Special Budget');
            expect(withoutTitle.VTITLE).toBeUndefined();
        });
    });

    describe('formatFormDetail', () => {
        it('should format FORMNO, link, and REQUEST_DATE in TypeScript cleanly', () => {
            const raw = {
                NFRMNO: 1,
                VORGNO: '050601',
                CYEAR: '24',
                CYEAR2: '2024',
                NRUNNO: 1,
                VANAME: 'IS',
                VFORMPAGE: '/form/is/fingerpIs/index.asp',
                DREQDATE: '2024-05-10',
                CREQTIME: '08:30:00',
            };

            const formatted = formatFormDetail(raw);
            expect(formatted.FORMNO).toBe('IS24-000001');
            expect(formatted.link).toContain('http://webflow.mitsubishielevatorasia.co.th/form/is/fingerpIs/index.asp?no=1&orgNo=050601&y=24&y2=2024&runNo=1&empno=');
            expect(formatted.REQUEST_DATE).toBeInstanceOf(Date);
        });

        it('should build standard query builder in formDetailQb without dialect-specific SQL', () => {
            const mockSelect = jest.fn().mockReturnThis();
            const mockFrom = jest.fn().mockReturnThis();
            const mockJoin = jest.fn().mockReturnThis();
            const mockDs: any = {
                createQueryBuilder: jest.fn().mockReturnValue({
                    select: mockSelect,
                    from: mockFrom,
                    innerJoin: mockJoin,
                    leftJoin: mockJoin,
                }),
            };

            formDetailQb(mockDs);
            expect(mockSelect).toHaveBeenCalledTimes(1);
            // Verify no dialect-specific functions like TO_DATE or STR_TO_DATE or CONCAT or ||
            const selectedCols = mockSelect.mock.calls[0][0];
            const colsString = Array.isArray(selectedCols) ? selectedCols.join(' ') : String(selectedCols);
            expect(colsString).not.toContain('TO_DATE');
            expect(colsString).not.toContain('STR_TO_DATE');
            expect(colsString).not.toContain('||');
        });
    });
});
