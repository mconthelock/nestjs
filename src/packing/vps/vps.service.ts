import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { PackResultDto, PackStatus, OrderDto } from './dto/pack-result.dto';
import { LogMethodErr } from './entities/log-method-err.entity';

enum VisErrCode {
    OK = '0',
    HAS_PIS = '1',
    FINISHED = '99',
    INFO = '-2',
}

@Injectable()
export class VPSService {
    constructor(
        @InjectRepository(LogMethodErr, 'packingConnection')
        private readonly logdb: Repository<LogMethodErr>,

        @InjectDataSource('packingConnection')
        private readonly db: DataSource,
    ) {}

    async checkVIS(vis: string, userId: string, useLocal: string): Promise<PackResultDto> {
        let response: PackResultDto;

        try {
            const [d] = await this.db.query('EXEC GetItemfromVIS @0,@1,@2', [
                vis,
                useLocal,
                userId,
            ]);

            switch (d.errcode) {
                case VisErrCode.OK:
                    response = await this.getPISfromVIS(vis, userId, useLocal);
                    break;

                case VisErrCode.HAS_PIS:
                    response = await this.listPIS(vis, userId, false);
                    break;

                case VisErrCode.FINISHED:
                    response = await this.listPIS(vis, userId, true);
                    break;

                default:
                    response = {
                        status: d.errcode === VisErrCode.INFO ? PackStatus.INFO : PackStatus.ERROR,
                        message: d.errmsg,
                    };
                    break;
            }

            const orders = await this.getOrder(vis);
            return { ...response, orders };
        } catch (error) {
            await this.keepSqlErr('CheckVISinfo', error.message, 1, userId);
            return { status: PackStatus.ERROR, message: error.message };
        }
    }

    async getOrder(vis: string): Promise<OrderDto[]> {
        try {
            const result = await this.db.query(
                `
                    SELECT orderno, SUBSTRING(caseno, 3, 2) AS block
                    FROM PackingMas
                    WHERE vis = @0
                `,
                [vis],
            );

            return result;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async getPISfromVIS(vis: string, userId: string, useLocal: string): Promise<PackResultDto> {
        try {
            const [d] = await this.db.query('EXEC InsertPackingDetail @0,@1,@2', [
                vis,
                useLocal,
                userId,
            ]);

            if (d.errstate === '0') {
                return this.listPIS(vis, userId, false);
            }

            return {
                status: PackStatus.INFO,
                message: d.errmsg,
            };
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async listPIS(vis: string, userId: string, finState: boolean): Promise<PackResultDto> {
        try {
            const rows = await this.db.query('EXEC GetListPIS @0,@1', [vis, userId]);

            if (!rows || rows.length === 0) {
                return {
                    status: PackStatus.INFO,
                    message: 'ไม่พบรายการ VPS กรุณาสแกน VIS ใหม่อีกครั้ง',
                };
            }

            const items = rows.map((r: any) => ({
                ordernoref: r.ordernoref,
                iteminfo: r.iteminfo,
                checksta: r.checksta === '1',
                vpscode: r.ordernoref.substring(1, 8) + r.iteminfo.replace(' #', ''),
            }));

            const eucomplete = await this.isEuComplete(vis);

            return {
                status: PackStatus.SUCCESS,
                message: '',
                chkcompte: finState,
                eucomplete: eucomplete,
                items: items,
            };
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async keepSqlErr(method: string, message: string, type: number, user: string): Promise<void> {
        try {
            const errmsg = message?.replace(/'/g, '//');
            await this.logdb.insert({
                ErrMethod: method,
                ErrDesc: errmsg,
                ErrType: type,
                ErrUser: user,
                ErrDate: () => 'GETDATE()',
            });
        } catch (error) {
            // console.error('keepSqlErr failed:', error);
        }
    }

    async checkPIS(vis: string, pis: string, userId: string): Promise<PackResultDto> {
        try {
            const [d] = await this.db.query('EXEC SavePISinPacking @0,@1,@2', [vis, pis, userId]);

            switch (d.errcode) {
                case VisErrCode.OK:
                    return {
                        status: PackStatus.SUCCESS,
                        message: d.errmsg,
                        chkcompte: false,
                    };
                    break;

                case VisErrCode.FINISHED:
                    return {
                        status: PackStatus.SUCCESS,
                        message: d.errmsg,
                        chkcompte: true,
                    };
                    break;

                default:
                    return { status: PackStatus.INFO, message: d.errmsg };
                    break;
            }
        } catch (error) {
            await this.keepSqlErr('CheckPisDetail', error.message, 1, userId);
            return { status: PackStatus.ERROR, message: error.message };
        }
    }

    async checkCloseVIS(vis: string, shipcode: string, userId: string): Promise<PackResultDto> {
        try {
            const [d] = await this.db.query('EXEC CheckBcForCloseVIS @0,@1,@2', [
                vis,
                shipcode,
                userId,
            ]);

            if (d.code === '1') {
                return this.visCheckComplate(vis, userId);
            }

            return {
                status: PackStatus.INFO,
                message: d.msge,
            };
        } catch (error) {
            return {
                status: PackStatus.ERROR,
                message: 'CheckCloseVIS failed: ' + error.message,
            };
        }
    }

    async visCheckComplate(vis: string, userId: string): Promise<PackResultDto> {
        try {
            const [d] = await this.db.query('EXEC CheckVIScompte @0,@1', [vis, userId]);

            return {
                status: d.errcode === '0' ? PackStatus.SUCCESS : PackStatus.INFO,
                message: d.errmsg,
            };
        } catch (error) {
            await this.keepSqlErr('VISCheckCompte', error.message, 1, userId);
            return {
                status: PackStatus.ERROR,
                message: error.message,
            };
        }
    }

    async getLostItem(vis: string, userId: string): Promise<PackResultDto> {
        try {
            const [d] = await this.db.query('EXEC CheckLostItem @0,@1', [vis, userId]);

            return {
                status: d.resultcode === '1' ? PackStatus.SUCCESS : PackStatus.INFO,
                message: d.resultmsg,
            };
        } catch (error) {
            return {
                status: PackStatus.ERROR,
                message: 'GetLostItem failed: ' + error.message,
            };
        }
    }

    async clearBlock(orderno: string, block: string): Promise<PackResultDto> {
        try {
            await this.db.query('EXEC Clear_designcase_validate @0,@1', [orderno, block]);

            return {
                status: PackStatus.SUCCESS,
                message: 'Clear block success',
            };
        } catch (error) {
            return {
                status: PackStatus.ERROR,
                message: error.message,
            };
        }
    }

    async confirmPackageID(vis: string, packageId: string, userId: string): Promise<PackResultDto> {
        try {
            const [d] = await this.db.query('EXEC SP_EU_CONFIRM_PACKAGE @0,@1,@2', [
                vis,
                packageId,
                userId,
            ]);

            return {
                status: d.STATUS === 'PASS' ? PackStatus.SUCCESS : PackStatus.INFO,
                message: d.MESSAGE,
                eucomplete: d.STATUS === 'PASS',
            };
        } catch (error) {
            return {
                status: PackStatus.ERROR,
                message: error.message,
            };
        }
    }

    async isEuComplete(vis: string): Promise<boolean> {
        const [d] = await this.db.query('EXEC SP_EU_IS_COMPLETE @0', [vis]);
        return d.STATUS === 'PASS';
    }
}
