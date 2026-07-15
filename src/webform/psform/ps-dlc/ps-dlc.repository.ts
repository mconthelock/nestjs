import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { ConectionService } from 'src/as400/conection/conection.service';
import { CreatePsdlcReqFormDto } from './dto/create-ps-dlc.dto';
import { UpdatePsdlcDetailDto } from './dto/update-ps-dlc.dto';
import { PSDLC_DETAIL } from 'src/common/Entities/webform/table/PSDLC_DETAIL.entity';
import { PSDLC_FORM } from 'src/common/Entities/webform/table/PSDLC_FORM.entity';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { PSDLCReportDto } from './dto/report-ps-dlc.dto';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';
import { FORMMST } from 'src/common/Entities/webform/table/FORMMST.entity';
import dayjs from 'dayjs';

@Injectable()
export class PSDLCRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        private readonly conn: ConectionService,
    ) {
        super(ds);
    }

    async createDetails(dto: CreatePsdlcReqFormDto) {
        return this.getRepository(PSDLC_DETAIL).save(dto);
    }

    async createForm(dto: CreatePsdlcReqFormDto) {
        return this.getRepository(PSDLC_FORM).save(dto);
    }

    async updateQ008mp(details: UpdatePsdlcDetailDto[]) {
        if (!details || details.length === 0) {
            return;
        }

        // สร้างวันที่ปัจจุบันในรูปแบบ YYYYMMDD
        // const today = new Date();
        // const yyyy = today.getFullYear().toString();
        // const mm = String(today.getMonth() + 1).padStart(2, '0');
        // const dd = String(today.getDate()).padStart(2, '0');
        // const currentDateStr = `${yyyy}${mm}${dd}`;
        const currentDateStr = dayjs().format('YYYYMMDD');

        for (const detail of details) {
            if (!detail.PNZUBA || !detail.PNHING) {
                continue;
            }

            const zuba = this.escapeSql(detail.PNZUBA.trim());
            const hing = this.escapeSql(detail.PNHING.trim());

            // --------------------------------------------------
            // 1. จัดการ PNRKUB = '0' (ทำ UPDATE ตามปกติ)
            // --------------------------------------------------
            const q008mpRow0 = this.buildPndataExpressionForRow0(detail);
            if (q008mpRow0) {
                const query = `UPDATE RTNLIBF.Q008MP SET PNDATA = ${q008mpRow0} WHERE PNZUBA = '${zuba}' AND PNHING = '${hing}' AND PNRKUB = '0'`;
                await this.conn.runQuery(query);
            }

            // --------------------------------------------------
            // 2. จัดการ PNRKUB = '2' (SELECT -> UPDATE / INSERT)
            // --------------------------------------------------
            const q008mpReference =
                this.buildPndataExpressionForReference(detail);

            if (q008mpReference) {
                const checkQuery = `SELECT COUNT(*) AS CNT FROM RTNLIBF.Q008MP WHERE PNZUBA = '${zuba}' AND PNHING = '${hing}' AND PNRKUB = '2'`;
                const checkResult = await this.conn.runQuery(checkQuery);

                const recordCount =
                    checkResult && checkResult.length > 0
                        ? Number(checkResult[0].CNT)
                        : 0;

                if (recordCount > 0) {
                    // ขั้นที่ 2A: เจอข้อมูล -> UPDATE
                    const updateQuery = `UPDATE RTNLIBF.Q008MP SET PNDATA = ${q008mpReference} WHERE PNZUBA = '${zuba}' AND PNHING = '${hing}' AND PNRKUB = '2'`;
                    await this.conn.runQuery(updateQuery);
                } else {
                    // ขั้นที่ 2B: ไม่เจอข้อมูล -> INSERT
                    // เพิ่ม PNDATE เข้าไปและใส่ค่า PNRKUB เป็น '2'
                    const insertQuery = `INSERT INTO RTNLIBF.Q008MP (PNZUBA, PNHING, PNRKUB, PNDATA, PNDATE) VALUES ('${zuba}', '${hing}', '2', ${q008mpReference}, '${currentDateStr}')`;
                    await this.conn.runQuery(insertQuery);
                }
            }
        }
    }

    private escapeSql(value: string): string {
        return value.replace(/'/g, "''").replace(/\r?\n/g, ' ');
    }

    private getFlagPosition(flag: string): number | null {
        const normalized = flag?.trim().toUpperCase();
        const pos23Group = ['Y', 'Z', 'M', 'J', 'P'];
        const pos24Group = [
            'I',
            'C',
            'B',
            'E',
            'S',
            'A',
            'W',
            'O',
            'H',
            'K',
            'N',
            'Q',
        ];

        if (pos23Group.includes(normalized)) {
            return 23;
        }
        if (pos24Group.includes(normalized)) {
            return 24;
        }
        return null; // ถ้าไม่ใช่ค่าที่อนุญาตเลย ให้คืนค่า null
    }

    private buildPndataExpressionForRow0(
        detail: UpdatePsdlcDetailDto,
    ): string | null {
        const flag = detail.NEWFLAG?.trim().toUpperCase();

        // เช็คว่า property NEWCODE ถูกส่งมาหรือไม่ (อนุญาตให้เป็น '' ได้)
        const hasCode = detail.NEWCODE !== undefined && detail.NEWCODE !== null;
        const code = hasCode ? detail.NEWCODE.trim() : null;

        if (!flag && !hasCode) {
            return null;
        }

        const flagPos = flag ? this.getFlagPosition(flag) : null;

        // กรณีมีทั้ง Flag (ที่ถูกต้อง) และ Code (รวมถึง Code ว่าง)
        if (flagPos !== null && hasCode) {
            const betweenLength = 45 - flagPos - 1;
            // ถ้า code เป็น '' การใช้ padEnd จะทำให้ได้ช่องว่างยาว 7 ตัวไปอัปเดตทับ ('       ')
            const codeValue = this.escapeSql(
                code!.padEnd(7, ' ').substring(0, 7),  
            );
            const flagValue = this.escapeSql(flag);
            return `SUBSTR(PNDATA,1,${flagPos - 1}) || '${flagValue}' || SUBSTR(PNDATA,${flagPos + 1},${betweenLength}) || '${codeValue}' || SUBSTR(PNDATA,52)`;
        }

        // กรณีมีแต่ Flag (ที่ถูกต้อง)
        if (flagPos !== null) {
            const flagValue = this.escapeSql(flag);
            return `SUBSTR(PNDATA,1,${flagPos - 1}) || '${flagValue}' || SUBSTR(PNDATA,${flagPos + 1})`;
        }

        // กรณีมีแต่ Code หรือมี Flag ที่ส่งค่ามาผิด (เลยทำแค่ Code แทน)
        if (hasCode) {
            const codeValue = this.escapeSql(
                code!.padEnd(7, ' ').substring(0, 7),
            );
            return `SUBSTR(PNDATA,1,44) || '${codeValue}' || SUBSTR(PNDATA,52)`;
        }

        return null;
    }
    // private buildPndataExpressionForRow0(
    //     detail: UpdatePsdlcDetailDto,
    // ): string | null {
    //     const flag = detail.NEWFLAG?.trim().toUpperCase();
    //     const code = detail.NEWCODE?.trim();

    //     if (!flag && !code) {
    //         return null;
    //     }

    //     const flagPos = flag ? this.getFlagPosition(flag) : null;

    //     // กรณีมีทั้ง Flag (ที่ถูกต้อง) และ Code
    //     if (flagPos !== null && code) {
    //         const betweenLength = 45 - flagPos - 1;
    //         const codeValue = this.escapeSql(
    //             code.padEnd(7, ' ').substring(0, 7),
    //         );
    //         const flagValue = this.escapeSql(flag);
    //         return `SUBSTR(PNDATA,1,${flagPos - 1}) || '${flagValue}' || SUBSTR(PNDATA,${flagPos + 1},${betweenLength}) || '${codeValue}' || SUBSTR(PNDATA,52)`;
    //     }

    //     // กรณีมีแต่ Flag (ที่ถูกต้อง)
    //     if (flagPos !== null) {
    //         const flagValue = this.escapeSql(flag);
    //         return `SUBSTR(PNDATA,1,${flagPos - 1}) || '${flagValue}' || SUBSTR(PNDATA,${flagPos + 1})`;
    //     }

    //     // กรณีมีแต่ Code หรือมี Flag ที่ส่งค่ามาผิด (เลยทำแค่ Code แทน)
    //     if (code) {
    //         const codeValue = this.escapeSql(
    //             code.padEnd(7, ' ').substring(0, 7),
    //         );
    //         return `SUBSTR(PNDATA,1,44) || '${codeValue}' || SUBSTR(PNDATA,52)`;
    //     }

    //     return null;
    // }

    private buildPndataExpressionForReference(
        detail: UpdatePsdlcDetailDto,
    ): string | null {
        const reference = detail.REFERENCE?.trim();
        if (!reference) {
            return null;
        }

        // กำหนดความยาวฟิกซ์ตายตัวตามขนาดคอลัมน์ใน AS400
        const maxLength = 115;

        // ทำความสะอาดข้อมูล เติมช่องว่างด้านหลังให้ครบ 115 ตัว และตัดส่วนเกินออก
        const referenceValue = this.escapeSql(reference)
            .padEnd(maxLength, ' ')
            .substring(0, maxLength);

        // เนื่องจากเป็นการแทนที่ตั้งแต่ตำแหน่งแรกจนจบฟิลด์ (115 ตัว)
        // สามารถคืนค่ากลับไปเป็น String ก้อนใหม่เพื่ออัปเดตทับได้เลย
        return `'${referenceValue}'`;
    }

    async findOne(dto: FormDto) {
        return this.manager
            .createQueryBuilder(PSDLC_FORM, 'req')
            .leftJoinAndSelect('req.form', 'form')
            .leftJoinAndSelect('req.formmaster', 'formmst')
            .where('req.NFRMNO = :NFRMNO', { NFRMNO: dto.NFRMNO })
            .andWhere('req.VORGNO = :VORGNO', { VORGNO: dto.VORGNO })
            .andWhere('req.CYEAR = :CYEAR', { CYEAR: dto.CYEAR })
            .andWhere('req.CYEAR2 = :CYEAR2', { CYEAR2: dto.CYEAR2 })
            .andWhere('req.NRUNNO = :NRUNNO', { NRUNNO: dto.NRUNNO })
            .getOne();
    }

    async findList(dto: FormDto) {
        return this.manager
            .createQueryBuilder(PSDLC_DETAIL, 'list')
            .where('list.NFRMNO = :NFRMNO', { NFRMNO: dto.NFRMNO })
            .andWhere('list.VORGNO = :VORGNO', { VORGNO: dto.VORGNO })
            .andWhere('list.CYEAR = :CYEAR', { CYEAR: dto.CYEAR })
            .andWhere('list.CYEAR2 = :CYEAR2', { CYEAR2: dto.CYEAR2 })
            .andWhere('list.NRUNNO = :NRUNNO', { NRUNNO: dto.NRUNNO })
            .orderBy('list.SEQNO', 'ASC')
            .getMany();
    }

    async findOneList(dto: FormDto) {
        const form = await this.findOne(dto);
        const list = await this.findList(dto);

        return {
            ...form,
            DETAILS: list,
        };
    }

    async search(dto: PSDLCReportDto) {
        const query = this.manager
            .createQueryBuilder(PSDLC_FORM, 'f')
            .innerJoin(
                PSDLC_DETAIL,
                'd',
                'f.NFRMNO = d.NFRMNO AND f.VORGNO = d.VORGNO AND f.CYEAR = d.CYEAR AND f.CYEAR2 = d.CYEAR2 AND f.NRUNNO = d.NRUNNO',
            )
            .innerJoin(
                FORM,
                'F',
                `f.NFRMNO = F.NFRMNO
                                AND f.VORGNO = F.VORGNO
                                AND f.CYEAR = F.CYEAR
                                AND f.CYEAR2 = F.CYEAR2
                                AND f.NRUNNO = F.NRUNNO`,
            )
            .innerJoin(
                FORMMST,
                'FM',
                `f.NFRMNO = FM.NNO
                                AND f.VORGNO = FM.VORGNO
                                AND f.CYEAR = FM.CYEAR`,
            )
            .addSelect('F.VREQNO', 'VREQNO')
            .addSelect('FM.VANAME', 'VANAME')
            .addSelect('d');
        if (dto.DRAWING) {
            query.andWhere('d.DRAWING LIKE :DRAWING', {
                DRAWING: `%${dto.DRAWING || ''}%`,
            });
        }
        if (dto.NEWCODE) {
            query.andWhere('d.NEWCODE LIKE :NEWCODE', {
                NEWCODE: `%${dto.NEWCODE || ''}%`,
            });
        }
        if (dto.OLDCODE) {
            query.andWhere('d.OLDCODE LIKE :OLDCODE', {
                OLDCODE: `%${dto.OLDCODE || ''}%`,
            });
        }
        if (dto.CHANGE_SCHD) {
            query.andWhere('f.CHANGE_SCHD LIKE :CHANGE_SCHD', {
                CHANGE_SCHD: `%${dto.CHANGE_SCHD || ''}%`,
            });
        }
        return query.getRawMany();
    }

    async updateDLCform(
        form: FormDto,
        status: string,
        date: Date,
        updateby: string,
    ) {
        return this.getRepository(PSDLC_FORM).update(form, {
            CHANGE_STATUS: status,
            ACTUAL_DATE: date,
            ACTUAL_UPDATEBY: updateby,
        });
    }
}
