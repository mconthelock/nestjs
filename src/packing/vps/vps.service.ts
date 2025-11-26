import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { PackItemDto } from './dto/pack-item.dto';
import { LogMethodErr } from './entities/log-method-err.entity';

@Injectable()
export class VPSService {
  constructor(
    @InjectRepository(LogMethodErr, 'packingConnection')
    private readonly logdb: Repository<LogMethodErr>,

    @InjectDataSource('packingConnection')
    private readonly db: DataSource,
  ) {}

  /**
   * Keep SQL error log (converted from .NET KeepSqlErr)
   * @author  Mr.Pathanapong ...
   * @since   2025-11-26
   * @param   {string} method Error method
   * @param   {string} message Error message
   * @param   {number} type Error type (0/1/etc.)
   * @param   {string} user User ID
   * @return  {Promise<void>}
   */
  async keepSqlErr(method: string, message: string, type: number, user: string): Promise<void> {
    try {
      const errmsg = message?.replace(/'/g, '//'); 
      await this.logdb.insert({
        ErrMethod: method,
        ErrDesc: errmsg,
        ErrType: type,
        ErrUser: user,
        ErrDate: () => 'GETDATE()'
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Check VIS info and return list of items or PIS
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-25
   * @param   {string} vis VIS code
   * @param   {string} userId User ID
   * @param   {string} useLocal Local table flag
   * @return  {Promise<PackItemDto>} Item DTO
   */
  async checkVIS(vis: string, userId: string, useLocal: string): Promise<PackItemDto> {
    try {
      const result = await this.db.query('exec GetItemfromVIS @0,@1,@2', [vis, useLocal, userId]);
      const d = result[0];
      switch (d.errcode) {
        case '0':
          return this.getPISfromVIS(vis, userId, useLocal);
        case '1':
          return this.listPIS(vis, userId, false);
        case '99':
          return this.listPIS(vis, userId, true);
        default:
          return { status:d.errcode, message:d.errmsg };
      }
    } catch (error) {
      await this.keepSqlErr('CheckVISinfo', error.message, 1, userId);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Insert PIS data from VIS and return updated PIS list
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-25
   * @param   {string} vis VIS code
   * @param   {string} userId User ID
   * @param   {string} useLocal Local table flag
   * @return  {Promise<PackItemDto>} Item DTO
   */
  async getPISfromVIS(vis: string, userId: string, useLocal: string): Promise<PackItemDto> {
    try {
      const result = await this.db.query('exec InsertPackingDetail @0,@1,@2', [vis, useLocal, userId]);
      const d = result[0];
      if (d.errstate === '0'){
        return this.listPIS(vis, userId, false);
      }else{
        return { status:d.errstate, message:d.errmsg }
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * List PIS items for selected VIS
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-25
   * @param   {string} vis VIS code
   * @param   {string} userId User ID
   * @param   {boolean} finState Finish state flag
   * @return  {Promise<PackItemDto>} Item DTO
   */
  async listPIS(vis: string, userId: string, finState: boolean): Promise<PackItemDto> {
    try {
      const result = await this.db.query('exec GetListPIS @0,@1', [vis, userId]);
      if (result.length === 0){
        return { status:'error', message:'ไม่พบรายการ VPS กรุณาสแกน VIS ใหม่อีกครั้ง' };
      } 

      if (!('ordernoref' in result[0])) {
        throw new Error("Column 'ordernoref' not found in query result");
      }

      return { status: 'success', message: 'OK', chkcompte: finState, items: result };
    } catch (error) {
      return { status:'error', message:error.message };
    }
  }

  /**
   * Validate PIS detail and save into packing table
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-25
   * @param   {string} vis VIS code
   * @param   {string} pis PIS code
   * @param   {string} userId User ID
   * @return  {Promise<PackItemDto>} Item DTOs
   */
  async checkPisDetail(vis: string, pis: string, userId: string): Promise<PackItemDto> {
    try {
      const rows = await this.db.query('exec SavePISinPacking @0,@1,@2', [vis, pis, userId]);
      return rows.map((r) => ({
        code: r[0],
        message: r[1],
      }));
    } catch (error) {
      throw new InternalServerErrorException('checkPisDetail failed: ' + error.message);
    }
  }

  /**
   * Check VIS before completing packing process (final validation)
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-25
   * @param   {string} vis VIS code
   * @param   {string} userId User ID
   * @return  {Promise<PackItemDto>} Item DTO
   */
  async visCheckCompte(vis: string, userId: string): Promise<PackItemDto> {
    try {
      const rows = await this.db.query('exec CheckVIScompte @0,@1', [vis, userId]);
      return rows.map((r) => ({ code: r[0], message: r[1] }));
    } catch (error) {
      throw new InternalServerErrorException('visCheckCompte failed: ' + error.message);
    }
  }

  /**
   * Check scanned barcode before closing VIS (final step of packing)
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-25
   * @param   {string} vis VIS code
   * @param   {string} barcode Scanned barcode
   * @param   {string} userId User ID
   * @return  {Promise<PackItemDto>} Item DTO
   */
  async checkInputBc(vis: string, barcode: string, userId: string): Promise<PackItemDto> {
    try {
      const result = await this.db.query('exec CheckBcForCloseVIS @0,@1,@2', [vis, barcode, userId]);
      const code = result[0]?.[0];
      const msg = result[0]?.[1];

      if (code === '1') return this.visCheckCompte(vis, userId);
      throw new InternalServerErrorException(msg);
    } catch (error) {
      throw new InternalServerErrorException('checkInputBc failed: ' + error.message);
    }
  }

  /**
   * Check if VIS contains lost items before allowing complete process
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-25
   * @param   {string} vis VIS code
   * @param   {string} userId User ID
   * @return  {Promise<boolean>} True if lost item exists
   */
  async getLostItem(vis: string, userId: string): Promise<boolean> {
    try {
      const result = await this.db.query('exec CheckLostItem @0,@1', [vis, userId]);
      const code = result[0]?.[0];
      const msg = result[0]?.[1];

      if (code === '0') throw new InternalServerErrorException(msg);
      return true;
    } catch (error) {
      throw new InternalServerErrorException('getLostItem failed: ' + error.message);
    }
  }
}
