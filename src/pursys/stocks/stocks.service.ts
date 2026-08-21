import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StockMovements } from 'src/common/Entities/pursys/table/STOCK_MOVEMENTS.entity';
import { StockMovementItems } from 'src/common/Entities/pursys/table/STOCK_MOVEMENT_ITEMS.entity';
import { InventoryBalances } from 'src/common/Entities/pursys/table/INVENTORY_BALANCES.entity';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class StocksService {
    constructor(
        @InjectRepository(StockMovements, 'purConnection')
        private readonly stockMovements: Repository<StockMovements>,
        @InjectRepository(StockMovementItems, 'purConnection')
        private readonly stockMovementItems: Repository<StockMovementItems>,
        @InjectRepository(InventoryBalances, 'purConnection')
        private readonly inventoryBalances: Repository<InventoryBalances>,
    ) {}

    async issueStock(data: CreateStockDto) {
        const { warehouseId, productId, lotId, quantity, remark } = data;

        const balance = await this.inventoryBalances.findOneBy({
            WAREHOUSE_ID: warehouseId,
            PRODUCT_ID: productId,
            LOT_ID: lotId,
        });

        if (!balance) {
            throw new NotFoundException(
                `Inventory not found for warehouse ${warehouseId}, product ${productId}, lot ${lotId}`,
            );
        }

        if (balance.QUANTITY < quantity) {
            throw new BadRequestException(
                `Insufficient stock: available ${balance.QUANTITY}, requested ${quantity}`,
            );
        }

        const movement = await this.stockMovements.save({
            DOCUMENT_NO: `ISS-${Date.now()}`,
            MOVEMENT_TYPE: 'ISSUE',
            SOURCE_STORAGE: warehouseId,
            DEST_STORAGE: 0,
            STATUS: 'POSTED',
            CREATED_AT: new Date(),
        });

        await this.stockMovementItems.save({
            MOVEMENT_ID: movement.MOVEMENT_ID,
            PRODUCT_ID: productId,
            LOT_ID: lotId,
            QUANTITY: quantity,
            UNIT_COST: 0,
            REMARK: remark ?? '',
        });

        const remainingQuantity = balance.QUANTITY - quantity;
        await this.inventoryBalances.save({
            ...balance,
            QUANTITY: remainingQuantity,
            UPDATED_AT: new Date(),
        });

        return {
            movementId: movement.MOVEMENT_ID,
            documentNo: movement.DOCUMENT_NO,
            warehouseId,
            productId,
            lotId,
            quantity,
            remainingQuantity,
        };
    }

    async receiveStock(data: CreateStockDto) {
        const { warehouseId, productId, lotId, quantity, remark } = data;

        const balance = (await this.inventoryBalances.findOneBy({
            WAREHOUSE_ID: warehouseId,
            PRODUCT_ID: productId,
            LOT_ID: lotId,
        })) ?? {
            WAREHOUSE_ID: warehouseId,
            PRODUCT_ID: productId,
            LOT_ID: lotId,
            QUANTITY: 0,
            RESERVED_QUANTITY: 0,
            UPDATED_AT: new Date(),
        };

        const movement = await this.stockMovements.save({
            DOCUMENT_NO: `RCV-${Date.now()}`,
            MOVEMENT_TYPE: 'RECEIVE',
            SOURCE_STORAGE: 0,
            DEST_STORAGE: warehouseId,
            STATUS: 'POSTED',
            CREATED_AT: new Date(),
        });

        await this.stockMovementItems.save({
            MOVEMENT_ID: movement.MOVEMENT_ID,
            PRODUCT_ID: productId,
            LOT_ID: lotId,
            QUANTITY: quantity,
            UNIT_COST: 0,
            REMARK: remark ?? '',
        });

        const newQuantity = balance.QUANTITY + quantity;
        await this.inventoryBalances.save({
            ...balance,
            QUANTITY: newQuantity,
            UPDATED_AT: new Date(),
        });

        return {
            movementId: movement.MOVEMENT_ID,
            documentNo: movement.DOCUMENT_NO,
            warehouseId,
            productId,
            lotId,
            quantity,
            newQuantity,
        };
    }
}
