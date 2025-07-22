
import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class GenerateIdService {
  constructor(
    @InjectDataSource('amecConnection')
    private dataSource: DataSource
) {}

  /**
   * สร้างเลข id ใหม่จาก max(col)+1 ของ table ที่กำหนด
   * @param table ชื่อ table (string)
   * @param col ชื่อ column ที่ต้องการหาค่า max (string)
   * @param cond เงื่อนไข where (object) เช่น { status: 1 }
   * @returns number
   */
  async generateId(table: string, col: string, cond: Record<string, any> = {}): Promise<number> {
    // สร้าง WHERE clause และ parameters
    let where = '';
    const params: any = {};

    Object.keys(cond).forEach((key, idx) => {
      where += idx === 0 ? `WHERE` : `AND`;
      where += ` ${key} = :${key} `;
      params[key] = cond[key];
    });

    // ใช้ native query
    const sql = `SELECT COALESCE(MAX(${col}),0) AS id FROM ${table} ${where}`;
    const result = await this.dataSource.query(sql, params);
    // [{ id: ... }]
    return Number(result[0]?.id ?? 0) + 1;
  }
}