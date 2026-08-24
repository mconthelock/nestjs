import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StocksService } from './stocks.service';
import { StockMovements } from 'src/common/Entities/pursys/table/STOCK_MOVEMENTS.entity';
import { StockMovementItems } from 'src/common/Entities/pursys/table/STOCK_MOVEMENT_ITEMS.entity';
import { InventoryBalances } from 'src/common/Entities/pursys/table/INVENTORY_BALANCES.entity';

describe('StocksService', () => {
    let service: StocksService;

    const stockMovementsRepository = {
        save: jest.fn(),
    };

    const stockMovementItemsRepository = {
        save: jest.fn(),
    };

    const inventoryBalancesRepository = {
        findOneBy: jest.fn(),
        save: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StocksService,
                {
                    provide: getRepositoryToken(
                        StockMovements,
                        'pursysConnection',
                    ),
                    useValue: stockMovementsRepository,
                },
                {
                    provide: getRepositoryToken(
                        StockMovementItems,
                        'pursysConnection',
                    ),
                    useValue: stockMovementItemsRepository,
                },
                {
                    provide: getRepositoryToken(
                        InventoryBalances,
                        'pursysConnection',
                    ),
                    useValue: inventoryBalancesRepository,
                },
            ],
        }).compile();

        service = module.get<StocksService>(StocksService);
        jest.clearAllMocks();
    });

    it('should issue stock and reduce inventory balance', async () => {
        const dto = {
            warehouseId: 1,
            productId: 10,
            lotId: 2,
            quantity: 5,
            remark: 'Issue for production',
        };

        inventoryBalancesRepository.findOneBy.mockResolvedValue({
            WAREHOUSE_ID: 1,
            PRODUCT_ID: 10,
            LOT_ID: 2,
            QUANTITY: 10,
            UPDATED_AT: new Date(),
        });

        stockMovementsRepository.save.mockResolvedValue({
            MOVEMENT_ID: 99,
            DOCUMENT_NO: 'ISS-001',
        });

        stockMovementItemsRepository.save.mockResolvedValue({
            ITEM_ID: 1,
        });

        inventoryBalancesRepository.save.mockResolvedValue({
            WAREHOUSE_ID: 1,
            PRODUCT_ID: 10,
            LOT_ID: 2,
            QUANTITY: 5,
        });

        const result = await service.issueStock(dto);

        expect(inventoryBalancesRepository.findOneBy).toHaveBeenCalledWith({
            WAREHOUSE_ID: 1,
            PRODUCT_ID: 10,
            LOT_ID: 2,
        });
        expect(stockMovementsRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
                MOVEMENT_TYPE: 'ISSUE',
                SOURCE_STORAGE: 1,
                STATUS: 'POSTED',
            }),
        );
        expect(stockMovementItemsRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
                PRODUCT_ID: 10,
                LOT_ID: 2,
                QUANTITY: 5,
            }),
        );
        expect(inventoryBalancesRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
                QUANTITY: 5,
            }),
        );
        expect(result).toEqual(
            expect.objectContaining({
                movementId: 99,
                quantity: 5,
            }),
        );
    });

    it('should receive stock and increase inventory balance', async () => {
        const dto = {
            warehouseId: 1,
            productId: 10,
            lotId: 2,
            quantity: 7,
            remark: 'Receive from supplier',
        };

        inventoryBalancesRepository.findOneBy.mockResolvedValue({
            WAREHOUSE_ID: 1,
            PRODUCT_ID: 10,
            LOT_ID: 2,
            QUANTITY: 3,
            RESERVED_QUANTITY: 0,
            UPDATED_AT: new Date(),
        });

        stockMovementsRepository.save.mockResolvedValue({
            MOVEMENT_ID: 100,
            DOCUMENT_NO: 'RCV-001',
        });

        stockMovementItemsRepository.save.mockResolvedValue({
            ITEM_ID: 2,
        });

        inventoryBalancesRepository.save.mockResolvedValue({
            WAREHOUSE_ID: 1,
            PRODUCT_ID: 10,
            LOT_ID: 2,
            QUANTITY: 10,
        });

        const result = await service.receiveStock(dto);

        expect(inventoryBalancesRepository.findOneBy).toHaveBeenCalledWith({
            WAREHOUSE_ID: 1,
            PRODUCT_ID: 10,
            LOT_ID: 2,
        });
        expect(stockMovementsRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
                MOVEMENT_TYPE: 'RECEIVE',
                DEST_STORAGE: 1,
                STATUS: 'POSTED',
            }),
        );
        expect(stockMovementItemsRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
                PRODUCT_ID: 10,
                LOT_ID: 2,
                QUANTITY: 7,
            }),
        );
        expect(inventoryBalancesRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
                QUANTITY: 10,
            }),
        );
        expect(result).toEqual(
            expect.objectContaining({
                movementId: 100,
                quantity: 7,
            }),
        );
    });
});
