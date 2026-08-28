import { Injectable } from '@nestjs/common';
import { DataSource, Repository, In, IsNull, Or, Equal } from 'typeorm';
import { AddToolsVendingDto } from './dto/addtools-vending.dto';
import { CreateImportDto } from './dto/import-vending.dto';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/common/Entities/pursys/table/PRODUCTS.entity';
import { TOOL_IMPORT_HISTORY } from 'src/common/Entities/skid/table/TOOL_IMPORT_HISTORY.entity';
import { TOOL_WITHDRAWAL } from 'src/common/Entities/skid/table/TOOL_WITHDRAWAL.entity';
import { TOOL_REFILL } from 'src/common/Entities/skid/table/TOOL_REFILL.entity';
import { VENDING_USER } from 'src/common/Entities/skid/table/VENDING_USER.entity';
import { AMECUSERALL } from 'src/common/Entities/amec/views/AMECUSERALL.entity';

@Injectable()
export class VendingRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') private readonly ds: DataSource,
        @InjectDataSource('purConnection') private pur: DataSource,
    ) {
        super(ds);
    }

    async getProduct() {
        return this.pur.getRepository(Products).find({
            relations: {
                category: true,
            },
            where: {
                category: {
                    PARENT_ID: In([6, 7]),
                },
                IS_VENDING: Or(IsNull(), Equal(0)),
            },
        });
    }

    async addTools(dto: AddToolsVendingDto) {
        const items = dto.ITEMS?.length ? dto.ITEMS : [];

        return this.ds.transaction(async (manager) => {
            const results = [];

            for (const item of items) {
                const result = await manager.update(
                    Products,
                    { ID: item.ID },
                    { IS_VENDING: '1' },
                );

                results.push(result);
            }

            return results;
        });
    }

    async getTools() {
        return this.getRepository(Products).find({
            where: {
                IS_VENDING: '1',
            },
            relations: {
                category: true,
            },
        });
    }

    async importVending(dto: CreateImportDto) {
        const { importHistory, withdrawals, refills } = dto;
        console.log('importHistory:', importHistory);
        console.log('withdrawals:', withdrawals);
        const head =
            await this.getRepository(TOOL_IMPORT_HISTORY).save(importHistory);
        const headId = head.IMPORT_ID;

        const withdrawalData = withdrawals.map((withdrawal) => ({
            ...withdrawal,
            IMPORT_ID: headId,
        }));

        await this.getRepository(TOOL_WITHDRAWAL).save(withdrawalData);
        const refillData = refills.map((refill) => ({
            ...refill,
            IMPORT_ID: headId,
        }));

        await this.getRepository(TOOL_REFILL).save(refillData);
    }

    async importHistory() {
        return this.getRepository(TOOL_IMPORT_HISTORY).find({
            order: {
                IMPORT_ID: 'ASC',
            },
            relations: {
                WITHDRAWALS: true,
                REFILLS: true,
            }
        });
    }

    async getImportDetail(importId: number) {
        const [importHistory, withdrawals, refills] = await Promise.all([
            this.getRepository(TOOL_IMPORT_HISTORY).findOne({
                where: {
                    IMPORT_ID: importId,
                },
            }),
            this.getRepository(TOOL_WITHDRAWAL).find({
                where: {
                    IMPORT_ID: importId,
                },
            }),
            this.getRepository(TOOL_REFILL).find({
                where: {
                    IMPORT_ID: importId,
                },
            }),
        ]);

        return {
            importHistory,
            withdrawals,
            refills,
        };
    }

    async deleteImport(importId: number) {
        return this.ds.transaction(async (manager) => {
            await manager.delete(TOOL_WITHDRAWAL, { IMPORT_ID: importId });
            await manager.delete(TOOL_REFILL, { IMPORT_ID: importId });
            await manager.delete(TOOL_IMPORT_HISTORY, { IMPORT_ID: importId });
        });
    }

    async getUserVending() {
        return this.getRepository(VENDING_USER)
            .createQueryBuilder('vendingUser')
            .leftJoinAndMapOne(
                'vendingUser.EMPDATA',
                AMECUSERALL,
                'EMPDATA',
                'EMPDATA.SEMPNO = vendingUser.EMPNO',
            )
            .where('vendingUser.STATUS = 1')
            .getMany();
    }

    async saveUserVending({ EMPNO }: { EMPNO: string[] }) {
        return this.getRepository(VENDING_USER).save(
            EMPNO.map(empno => ({ EMPNO: empno }))
        );
    }
}
