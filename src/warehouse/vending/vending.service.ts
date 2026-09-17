import { Injectable } from '@nestjs/common';
import { CreateVendingDto } from './dto/create-vending.dto';
import { UpdateVendingDto } from './dto/update-vending.dto';
import { AddToolsVendingDto } from './dto/addtools-vending.dto';
import { VendingRepository } from './vending.repository';
import { CreateImportDto } from './dto/import-vending.dto';
import { VENDING_USER } from 'src/common/Entities/skid/table/VENDING_USER.entity';
import { FormService } from 'src/webform/form/form.service';
import { StocksService } from 'src/pursys/stocks/stocks.service';

@Injectable()
export class VendingService {
    constructor(
        private readonly vendingrepo: VendingRepository,
        private readonly formService: FormService,
        private readonly stocksService: StocksService
    ) {}

    async getProduct() {
        try {
            return await this.vendingrepo.getProduct();
        } catch (error) {
            throw error;
        }
    }

    async addTools(dto: AddToolsVendingDto) {
        try {
            return await this.vendingrepo.addTools(dto);
        } catch (error) {
            throw error;
        }
    }

    async getTools() {
        try {
            return await this.vendingrepo.getTools();
        } catch (error) {
            throw error;
        }
    }

    async importVending(dto: CreateImportDto) {
        // console.log('importVending dto:', dto);
        try {
            const { importHistory, withdrawals } = dto;
            const stockWithdrawalData = withdrawals.map((withdrawal) => ({
                PRODUCT_ID: withdrawal.PRODUCT_ID,
                QUANTITY: withdrawal.QUANTITY,
                UNIT_COST: withdrawal.UNIT_PRICE,
            }));

            const stock_withdrawal = {
                DOCUMENT_NO: importHistory.FILE_NAME,
                STORAGE_FROM: 21,
                CSTATUS: '1',
                CREATED_BY: importHistory.IMPORT_BY ?? '',
                ITEMS: stockWithdrawalData,
            };

            const issue = await this.stocksService.createStockTransaction(
                stock_withdrawal,
                1,
            );
            console.log('stock_withdrawal:', stock_withdrawal);

            const importResult = await this.vendingrepo.importVending(dto);
            let receiveId: number | null = null;
            const stockReceiveData = importResult.refills.map((refill) => ({
                PRODUCT_ID: refill.PRODUCT_ID,
                QUANTITY: refill.REFILL_QTY,
                UNIT_COST: 0,
            }));

            if (stockReceiveData.length) {
                const stock_receive = {
                    DOCUMENT_NO: importHistory.FILE_NAME,
                    STORAGE_TO: 21,
                    CSTATUS: '1',
                    CREATED_BY: importHistory.IMPORT_BY ?? '',
                    ITEMS: stockReceiveData,
                };

                const receive = await this.stocksService.createStockTransaction(
                    stock_receive,
                    2,
                );
                receiveId = receive.ID;
            }

            await this.vendingrepo.updateImportTransactionIds(
                importResult.importHistory.IMPORT_ID,
                issue.ID,
                receiveId,
            );
            importResult.importHistory.ISSUE_ID = issue.ID;
            importResult.importHistory.RECEIVE_ID = receiveId;

            return importResult;
        } catch (error) {
            throw error;
        }
    }

    async importHistory() {
        try {
            return await this.vendingrepo.importHistory();
        } catch (error) {
            throw error;
        }
    }

    async getImportDetail(importId: number) {
        try {
            return await this.vendingrepo.getImportDetail(importId);
        } catch (error) {
            throw error;
        }
    }

    async deleteImport(importId: number) {
        try {
            return await this.vendingrepo.deleteImport(importId);
        } catch (error) {
            throw error;
        }
    }

    async getUserVending() {
        try {
            return await this.vendingrepo.getUserVending();
        } catch (error) {
            throw error;
        }
    }

    async saveUserVending(EMPNO: string[], CREATED_BY: string) {
        try {
            return await this.vendingrepo.saveUserVending({
                EMPNO,
                CREATED_BY,
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteUserVending(EMPNO: string, UPDATED_BY: string) {
        try {
            return await this.vendingrepo.deleteUserVending(EMPNO, UPDATED_BY);
        } catch (error) {
            throw error;
        }
    }

    async getToolWithdrawalWithRequest() {
        try {
            // return await this.vendingrepo.getToolWithdrawalWithRequest();
            const request =
                await this.vendingrepo.getToolWithdrawalWithRequest();
            return request;
            // return await Promise.all(
            //     request.map(async (item) => {
            //         const formValues = [
            //             item.NFRMNO,
            //             item.VORGNO,
            //             item.CYEAR,
            //             item.CYEAR2,
            //             item.NRUNNO,
            //         ];

            //         if (formValues.some((value) => value == null)) {
            //             item.FORMNO = null;
            //             return item;
            //         }

            //         item.FORMNO = await this.formService.getFormno({
            //             NFRMNO: item.NFRMNO,
            //             VORGNO: item.VORGNO,
            //             CYEAR: item.CYEAR,
            //             CYEAR2: item.CYEAR2,
            //             NRUNNO: item.NRUNNO,
            //         });
            //         return item;
            //     }),
            // );
        } catch (error) {
            throw error;
        }
    }

    async getRequestWithdrawal() {
        const data = await this.vendingrepo.getRequestWithdrawal();

        // Step 1: Group และ sum QTY พร้อมเก็บ form header ที่ไม่ซ้ำไว้เป็น array
        const grouped = (data as any[]).reduce<Record<string, any>>(
            (acc, item) => {
                const key = `${item.EMPNO}|${item.REQUEST_DATE}|${item.PRODUCT_ID}`;

                if (!acc[key]) {
                    acc[key] = {
                        ...item,
                        QTY: 0,
                        formHeaders: [], // เก็บ combo ของ NFRMNO/VORGNO/CYEAR/CYEAR2/NRUNNO ที่ไม่ซ้ำ
                    };
                }

                acc[key].QTY += item.QTY;

                const formKey = `${item.NFRMNO}|${item.VORGNO}|${item.CYEAR}|${item.CYEAR2}|${item.NRUNNO}`;
                const exists = acc[key].formHeaders.some(
                    (f: any) => f.key === formKey,
                );
                if (!exists) {
                    acc[key].formHeaders.push({
                        key: formKey,
                        NFRMNO: item.NFRMNO,
                        VORGNO: item.VORGNO,
                        CYEAR: item.CYEAR,
                        CYEAR2: item.CYEAR2,
                        NRUNNO: item.NRUNNO,
                    });
                }

                return acc;
            },
            {},
        );

        const resultArray = Object.values(grouped);

        // Step 2: เรียก getFormno แยกตาม form header ที่ไม่ซ้ำ แล้วรวมเป็น array
        for (const item of resultArray) {
            item.FORMNO = await Promise.all(
                item.formHeaders.map((f: any) =>
                    this.formService.getFormno({
                        NFRMNO: f.NFRMNO,
                        VORGNO: f.VORGNO,
                        CYEAR: f.CYEAR,
                        CYEAR2: f.CYEAR2,
                        NRUNNO: f.NRUNNO,
                    }),
                ),
            );
            delete item.formHeaders; // ลบ field ชั่วคราวออก ถ้าไม่ต้องการให้ปนมาใน response
        }

        return resultArray;
    }

    async getIssueWithdrawal() {
        const data = await this.vendingrepo.getRequestWithdrawal();
        return data;
    }

    async getTransactionHistory() {
        const data = await this.vendingrepo.getTransactionHistory();
        return data;
    }
}
