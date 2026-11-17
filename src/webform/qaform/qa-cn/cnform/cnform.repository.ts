import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { Brackets, DataSource } from 'typeorm';
import { CreateCnformDto } from './dto/create-cnform.dto';
import { UpdateCnformDto } from './dto/update-cnform.dto';
import { CNFORM } from 'src/common/Entities/webform/table/CNFORM.entity';
import { CNITMINCHARGE } from 'src/common/Entities/webform/table/CNITMINCHARGE.entity';

@Injectable()
export class CnFormRepository extends BaseRepository {
    constructor(@InjectDataSource('mitsuConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async insert(dto: CreateCnformDto) {
        return this.getRepository(CNFORM).insert(dto);
    }

    async create(dto: CreateCnformDto) {
        return this.getRepository(CNFORM).save(dto);
    }

    async findByCondition(con: FormDto) {
        return this.getRepository(CNFORM).find({
            where: {
                ...con,
            },
        });
    }

    async findInc(itm: number): Promise<string | null> {
        const result = await this.getRepository(CNITMINCHARGE).findOne({
            where: { ITEMNO: itm },
            select: ['INCHARGE'], // เลือกดึงมาเฉพาะฟิลด์ที่ต้องการ
        });

        // คืนค่า INCHARGE หากค้นพบข้อมูล หากไม่พบจะคืนค่า null
        return result ? result.INCHARGE : null;
    }

    async update(con: FormDto, dto: UpdateCnformDto): Promise<boolean> {
        const result = await this.getRepository(CNFORM).update(con, dto);
        return (result.affected ?? 0) > 0;
    }

    async deleteAll(dto: FormDto) {
        return this.getRepository(CNFORM).delete(dto);
    }

    async getFirstNo(con: FormDto): Promise<any> {
        return await this.getRepository(CNFORM)
            .createQueryBuilder('cnform')
            // ใช้ Raw Query สำหรับ REGEXP_SUBSTR และตั้งชื่อ AS ว่า FIRSTNO
            .select("REGEXP_SUBSTR(cnform.RSNOTHER, 'F[0-9]+')", 'FIRSTNO')
            .where('cnform.NFRMNO = :nfrmno', { nfrmno: con.NFRMNO })
            .andWhere('cnform.VORGNO = :vorgno', { vorgno: con.VORGNO })
            .andWhere('cnform.CYEAR = :cyear', { cyear: con.CYEAR })
            .andWhere('cnform.CYEAR2 = :cyear2', { cyear2: con.CYEAR2 })
            .andWhere('cnform.NRUNNO = :nrunno', { nrunno: con.NRUNNO })
            // getRawMany() จะรีเทิร์นค่าออกมาเป็น Array Object คล้ายกับ result() ของ CodeIgniter
            .getRawOne();
    }
    async getQueryBuilderResult(dto: FormDto) {
        return await this.getRepository(CNFORM)
            // 1. เปลี่ยน Alias หลักเป็นตัวพิมพ์ใหญ่ (CNF)
            .createQueryBuilder('CNF')
            .select([
                'CNJ.JDGMNTNO AS jdgmntno',
                'CNJ.JUDGEMENT AS judgement',
                'CNF.JDGOTHER AS jdgother',
                'CNF.SVENDNAME AS svendname',
                'CNF.PRTNAME AS prtname',
                'CHK.DWGNO AS dwgno',
                'CHK.RESULT AS result',
            ])
            // 2. อ้างอิงตัวแปรเป็น CNF ตัวพิมพ์ใหญ่
            .addSelect("REGEXP_SUBSTR(CNF.RSNOTHER, 'F[0-9]+')", 'FIRSTNO')
            .addSelect("REGEXP_SUBSTR(CNF.DETTRANS, 'shop at\\s*(.*)', 1, 1, NULL, 1)", 'SHOPNO')

            // 3. เปลี่ยนชื่อย่อตาราง JOIN เป็น CNJ และ CHK ตัวพิมพ์ใหญ่
            .leftJoin('CNJUDGEMENT', 'CNJ', 'CNJ.JDGMNTNO = CNF.JDGMNTNO')
            .innerJoin(
                'RESULTCHKDWG',
                'CHK',
                `CHK.NFRMNO = CNF.NFRMNO
            AND CHK.VORGNO = CNF.VORGNO
            AND CHK.CYEAR  = CNF.CYEAR
            AND CHK.CYEAR2 = CNF.CYEAR2
            AND CHK.NRUNNO = CNF.NRUNNO`,
            )

            // 4. เงื่อนไข WHERE ก็ใช้ CNF ตัวพิมพ์ใหญ่เช่นกัน
            .where('CNF.NFRMNO = :nfrmno', { nfrmno: dto.NFRMNO })
            .andWhere('CNF.VORGNO = :vorgno', { vorgno: dto.VORGNO })
            .andWhere('CNF.CYEAR = :cyear', { cyear: dto.CYEAR })
            .andWhere('CNF.CYEAR2 = :cyear2', { cyear2: dto.CYEAR2 })
            .andWhere('CNF.NRUNNO = :nrunno', { nrunno: dto.NRUNNO })

            .getRawMany();
    }
    async getApvEmail(dto: FormDto, type: string): Promise<any[]> {
        const baseConditions = [dto.NFRMNO, dto.VORGNO, dto.CYEAR, dto.CYEAR2, dto.NRUNNO];
        let sql = '';

        if (type === 'PIC') {
            sql = `
                SELECT DISTINCT E.SRECMAIL AS "EMAIL"
                FROM AMEC.AMECUSERALL E
                INNER JOIN (
                    SELECT F.VAPVNO AS EMPNO FROM WEBFORM.FLOW F
                    WHERE F.NFRMNO = $1 AND F.VORGNO = $2
                      AND F.CYEAR = $3 AND F.CYEAR2 = $4 AND F.NRUNNO = $5
                      AND F.CSTEPNO = '--'
                    UNION
                    SELECT F.VREPNO FROM WEBFORM.FLOW F
                    WHERE F.NFRMNO = $1 AND F.VORGNO = $2
                      AND F.CYEAR = $3 AND F.CYEAR2 = $4 AND F.NRUNNO = $5
                      AND F.CSTEPNO = '--'
                    UNION
                    SELECT C.ENG FROM WEBFORM.CNSHOPPIC C
                    WHERE C.FM IN (
                        SELECT F2.VAPVNO FROM WEBFORM.FLOW F2
                        WHERE F2.NFRMNO = $1 AND F2.VORGNO = $2
                          AND F2.CYEAR = $3 AND F2.CYEAR2 = $4 AND F2.NRUNNO = $5
                          AND F2.CEXTDATA = '06'
                    )
                ) P ON P.EMPNO = E.SEMPNO
                WHERE E.CSTATUS = '1'
            `;
        } else {
            let typeCondition = '';
            if (type === 'REQUESTER') {
                typeCondition = "AND F.CSTEPNO = '--'";
            } else if (type === 'FOREMAN') {
                typeCondition = "AND F.CEXTDATA = '06'";
            } else if (type === 'ALL') {
                typeCondition = "AND F.CSTEPNO NOT IN ('05','04','11')";
            }

            sql = `
                SELECT DISTINCT E.SRECMAIL AS "EMAIL"
                FROM AMEC.AMECUSERALL E
                INNER JOIN WEBFORM.FLOW F ON (F.VAPVNO = E.SEMPNO OR F.VREPNO = E.SEMPNO)
                WHERE E.CSTATUS = '1'
                  AND F.NFRMNO = $1
                  AND F.VORGNO = $2
                  AND F.CYEAR = $3
                  AND F.CYEAR2 = $4
                  AND F.NRUNNO = $5
                  ${typeCondition}
            `;
        }

        // ข้อควรระวัง: TypeORM กับ Oracle มักใช้ ? แทน $1, $2 (ขึ้นอยู่กับ Driver)
        // ถ้าใช้ oracledb อาจจะต้องใช้ :1, :2, :3 หรือใช้ Array พารามิเตอร์ปกติ
        return await this.manager.query(sql, baseConditions);
    }

    async executeRawSql(sql: string, params: any[]): Promise<any[]> {
        // console.log('DATABASE:', this.manager.connection.options);
        // const res = await this.manager.query(
        //     `SELECT *
        //  FROM "FLOW" T1
        //  JOIN "AMEC"."AMECUSERALL" T2
        //      ON T1.VREALAPV = T2.SEMPNO
        //  WHERE T1.NFRMNO = 4
        //    AND T1.VORGNO = '050301'
        //    AND T1.CYEAR = '10'
        //    AND T1.CYEAR2 = '2026'
        //    AND T1.NRUNNO = 1389`,
        // );
        const res = await this.manager.query(sql, params);
        console.log('***********', res);

        return res;
    }
}
