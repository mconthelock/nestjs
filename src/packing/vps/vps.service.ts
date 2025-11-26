import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ItemDto } from './dto/item.dto';

@Injectable()
export class VPSService {
  constructor(
    @InjectDataSource('packingConnection')
    private md: DataSource,
  ) {}

  /**
   * Check VIS info and return list of items or PIS
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-25
   * @param   {string} vis VIS code
   * @param   {string} userId User ID
   * @param   {string} useLocal Local table flag
   * @return  {Promise<ItemDto[]>} List of item DTOs
   */
  async checkVis(vis: string, userId: string, useLocal: string): Promise<ItemDto[]> {
    try {
      const result = await this.md.query('exec GetItemfromVIS @0,@1,@2', [vis, useLocal, userId]);
      const code = result[0]?.[0];
      const msg = result[0]?.[1];

      if (code === '0') return this.getPISfromVis(vis, userId, useLocal);
      if (code === '1') return this.listPIS(vis, userId, false);
      if (code === '99') return this.listPIS(vis, userId, true);

      return [{ code, message: msg }];
    } catch (error) {
      throw new InternalServerErrorException('CheckVISinfo failed: ' + error.message);
    }
  }

  async getPISfromVis(vis: string, userId: string, useLocal: string): Promise<ItemDto[]> {
    try {
      const result = await this.md.query('exec InsertPackingDetail @0,@1,@2', [vis, useLocal, userId]);
      const code = result[0]?.[0];
      const msg = result[0]?.[1];

      if (code === '0') return this.listPIS(vis, userId, false);
      return [{ code, message: msg }];
    } catch (error) {
      throw new InternalServerErrorException('getPISfromVis failed: ' + error.message);
    }
  }

  async listPIS(vis: string, userId: string, finState: boolean): Promise<ItemDto[]> {
    try {
      const list = await this.md.query('exec GetListPIS @0,@1', [vis, userId]);
      if (!list.length) throw new InternalServerErrorException('ไม่พบรายการ VPS กรุณาสแกน VIS ใหม่อีกครั้ง');

      return list.map((r) => ({
        code: r[0],
        message: r[1],
        data1: r[2],
        data2: finState ? '1' : undefined,
      }));
    } catch (error) {
      throw new InternalServerErrorException('listPIS failed: ' + error.message);
    }
  }

  async checkPisDetail(vis: string, pis: string, userId: string): Promise<ItemDto[]> {
    try {
      const rows = await this.md.query('exec SavePISinPacking @0,@1,@2', [vis, pis, userId]);
      return rows.map((r) => ({
        code: r[0],
        message: r[1],
      }));
    } catch (error) {
      throw new InternalServerErrorException('checkPisDetail failed: ' + error.message);
    }
  }

  async visCheckCompte(vis: string, userId: string): Promise<ItemDto[]> {
    try {
      const rows = await this.md.query('exec CheckVIScompte @0,@1', [vis, userId]);
      return rows.map((r) => ({ code: r[0], message: r[1] }));
    } catch (error) {
      throw new InternalServerErrorException('visCheckCompte failed: ' + error.message);
    }
  }

  async checkInputBc(vis: string, barcode: string, userId: string): Promise<ItemDto[]> {
    try {
      const result = await this.md.query('exec CheckBcForCloseVIS @0,@1,@2', [vis, barcode, userId]);
      const code = result[0]?.[0];
      const msg = result[0]?.[1];

      if (code === '1') return this.visCheckCompte(vis, userId);
      throw new InternalServerErrorException(msg);
    } catch (error) {
      throw new InternalServerErrorException('checkInputBc failed: ' + error.message);
    }
  }

  async getLostItem(vis: string, userId: string): Promise<boolean> {
    try {
      const result = await this.md.query('exec CheckLostItem @0,@1', [vis, userId]);
      const code = result[0]?.[0];
      const msg = result[0]?.[1];

      if (code === '0') throw new InternalServerErrorException(msg);
      return true;
    } catch (error) {
      throw new InternalServerErrorException('getLostItem failed: ' + error.message);
    }
  }
}
