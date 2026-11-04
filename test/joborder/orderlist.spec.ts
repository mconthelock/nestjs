import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { OrderListService } from 'src/joborder/orderlist/orderlist.service';
import { OrderListController } from 'src/joborder/orderlist/orderlist.controller';
import { SearchOrderListDto } from 'src/joborder/orderlist/dto/search-orderlist.dto';

describe('OrderList Module', () => {
    describe('DTO Validation', () => {
        it('should validate valid SearchOrderListDto', async () => {
            const dto = plainToInstance(SearchOrderListDto, {
                MFGNO: 'M12345',
                PONO: 100,
                PRNO: 200,
                LINENO: 1,
                BUYEREMPNO: 'EMP99',
                TURNOVER_STATUS: 1,
                JOP_PUR_STATUS: 0,
                distinct: true,
                orderby: 'PRJ_NO',
                orderbyDirection: 'ASC',
            });
            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should validate status values', async () => {
            const dto = plainToInstance(SearchOrderListDto, {
                JOP_PUR_STATUS: 2,
                TURNOVER_STATUS: 0,
            });
            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });
    });

    describe('OrderListService', () => {
        let service: OrderListService;
        let mockOrderListRepo: any;
        let mockDataSource: any;
        let mockJopMarReqService: any;
        let mockJopPurConfService: any;
        let mockQb: any;

        beforeEach(() => {
            mockOrderListRepo = {
                metadata: {
                    columns: [
                        { propertyName: 'MFGNO' },
                        { propertyName: 'PONO' },
                        { propertyName: 'PRNO' },
                        { propertyName: 'LINENO' },
                        { propertyName: 'PRJ_NO' },
                        { propertyName: 'ORDTYPE' },
                        { propertyName: 'REQUESTED_QTY' },
                        { propertyName: 'RECIEVE_QTY' },
                        { propertyName: 'TURNOVER_STATUS' },
                    ],
                },
            };

            mockQb = {
                from: jest.fn().mockReturnThis(),
                distinct: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                addSelect: jest.fn().mockReturnThis(),
                leftJoin: jest.fn().mockReturnThis(),
                getRawMany: jest.fn().mockResolvedValue([]),
            };

            mockDataSource = {
                createQueryBuilder: jest.fn().mockReturnValue(mockQb),
            };

            mockJopMarReqService = {
                getRevisionHistoryByKey: jest.fn().mockResolvedValue([]),
                getRevisionHistory: jest.fn().mockResolvedValue([]),
            };

            mockJopPurConfService = {
                getRevisionHistoryByKey: jest.fn().mockResolvedValue([]),
                getRevisionHistory: jest.fn().mockResolvedValue([]),
            };

            service = new OrderListService(
                mockOrderListRepo,
                mockDataSource,
                mockJopMarReqService,
                mockJopPurConfService,
            );
        });

        it('should search orderlistNew with query and fetch revision history', async () => {
            const mockRawRows = [
                {
                    MFGNO: 'M001',
                    PONO: 10,
                    LINENO: 1,
                    JOP_MFGNO: 'M001',
                    JOP_PONO: 10,
                    JOP_LINENO: 1,
                    JOP_MAR_REVISION: 1,
                    JOP_PUR_REVISION: 0,
                },
            ];
            mockQb.getRawMany.mockResolvedValue(mockRawRows);

            mockJopMarReqService.getRevisionHistoryByKey.mockResolvedValue([
                {
                    REVTYPE: 'MAR',
                    MFGNO: 'M001',
                    PONO: 10,
                    LINENO: 1,
                    REVISION: 1,
                    ACTION_BY: 'EMP01',
                },
            ]);

            const dto: SearchOrderListDto = {
                MFGNO: 'M001',
                PONO: 10,
            };

            const result = await service.orderlistNew(dto);

            expect(mockDataSource.createQueryBuilder).toHaveBeenCalled();
            expect(mockQb.from).toHaveBeenCalledWith('MV_JOB_ORDER', 'O');
            expect(mockQb.andWhere).toHaveBeenCalledWith('O.MFGNO = :MFGNO', { MFGNO: 'M001' });
            expect(mockQb.andWhere).toHaveBeenCalledWith('O.PONO = :PONO', { PONO: 10 });
            expect(mockJopMarReqService.getRevisionHistoryByKey).toHaveBeenCalledWith([
                { mfg: 'M001', pono: 10, line: 1 },
            ]);
            expect(result[0].MAR_REVISION).toHaveLength(1);
            expect(result[0].PUR_REVISION).toEqual([]);
        });

        it('should apply status filter 0 for confirm endpoint', async () => {
            mockQb.getRawMany.mockResolvedValue([]);
            const dto: SearchOrderListDto = {};

            await service.confirm(dto);

            expect(mockQb.andWhere).toHaveBeenCalledWith('J.JOP_PUR_STATUS = :status', {
                status: 0,
            });
        });

        it('should apply condition for shipment endpoint', async () => {
            mockQb.getRawMany.mockResolvedValue([]);
            const dto: SearchOrderListDto = {};

            await service.shipment(dto);

            expect(mockQb.andWhere).toHaveBeenCalledWith('O.REQUESTED_QTY != O.RECIEVE_QTY');
        });

        it('should attach individual revision history in getRevisionHistory', async () => {
            mockJopMarReqService.getRevisionHistory.mockResolvedValue([
                {
                    JOP_REVISION: 1,
                    JOP_MAR_REQUEST: 'EMP01',
                    JOP_MAR_REQUEST_DATE: new Date(),
                    JOP_MAR_INPUT_DATE: new Date(),
                    JOP_MAR_REMARK: 'Note',
                    marRequest: { SNAME: 'User A' },
                },
            ]);

            mockJopPurConfService.getRevisionHistory.mockResolvedValue([
                {
                    JOP_REVISION: 1,
                    JOP_PUR_CONFIRM: 'EMP02',
                    JOP_PUR_CONFIRM_DATE: new Date(),
                    JOP_PUR_INPUT_DATE: new Date(),
                    JOP_PUR_REMARK: 'Ok',
                    purConfirm: { SNAME: 'User B' },
                },
            ]);

            const list = [
                {
                    JOP_MFGNO: 'M001',
                    JOP_PONO: 10,
                    JOP_LINENO: 1,
                    JOP_MAR_REVISION: 1,
                    JOP_PUR_REVISION: 1,
                },
            ];

            const result = await service.getRevisionHistory(list);

            expect(result[0].MAR_REVISION).toHaveLength(1);
            expect(result[0].MAR_REVISION[0].REVISION_TEXT).toBe('A');
            expect(result[0].MAR_REVISION[0].NAME).toBe('User A');
            expect(result[0].PUR_REVISION).toHaveLength(1);
            expect(result[0].PUR_REVISION[0].REVISION_TEXT).toBe('A');
            expect(result[0].PUR_REVISION[0].NAME).toBe('User B');
        });
    });

    describe('OrderListController', () => {
        let controller: OrderListController;
        let mockService: any;

        beforeEach(() => {
            mockService = {
                orderlistNew: jest.fn(),
                confirm: jest.fn(),
                shipment: jest.fn(),
            };
            controller = new OrderListController(mockService);
        });

        it('should call orderlistNew', async () => {
            const dto: SearchOrderListDto = { MFGNO: 'M001' };
            mockService.orderlistNew.mockResolvedValue([{ MFGNO: 'M001' }]);
            const res = await controller.orderlistNew(dto);
            expect(mockService.orderlistNew).toHaveBeenCalledWith(dto);
            expect(res).toEqual([{ MFGNO: 'M001' }]);
        });

        it('should call confirm', async () => {
            const dto: SearchOrderListDto = { MFGNO: 'M001' };
            mockService.confirm.mockResolvedValue([]);
            const res = await controller.confirm(dto);
            expect(mockService.confirm).toHaveBeenCalledWith(dto);
            expect(res).toEqual([]);
        });

        it('should call shipment', async () => {
            const dto: SearchOrderListDto = { MFGNO: 'M001' };
            mockService.shipment.mockResolvedValue([]);
            const res = await controller.shipment(dto);
            expect(mockService.shipment).toHaveBeenCalledWith(dto);
            expect(res).toEqual([]);
        });
    });
});
