import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { PackResultDto, PackStatus } from './dto/pack-result.dto';
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

  /**
   * Check VIS info and return list of items or PIS
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-25
   * @param   {string} vis VIS code
   * @param   {string} userId User ID
   * @param   {string} useLocal Local table flag
   * @return  {Promise<PackResultDto>} Item DTO
   */
  async checkVIS(vis: string, userId: string, useLocal: string): Promise<PackResultDto> {
    try {
      const [d] = await this.db.query(
        'EXEC GetItemfromVIS @0,@1,@2',
        [vis, useLocal, userId],
      );

      switch (d.errcode) {
        case VisErrCode.OK:
          return this.getPISfromVIS(vis, userId, useLocal);
        case VisErrCode.HAS_PIS:
          return this.listPIS(vis, userId, false);
        case VisErrCode.FINISHED:
          return this.listPIS(vis, userId, true);
        default:
          return {
            status: d.errcode === VisErrCode.INFO ? PackStatus.INFO : PackStatus.ERROR,
            message: d.errmsg
          };
      }
    } catch (error) {
      await this.keepSqlErr('CheckVISinfo', error.message, 1, userId);
      return { status: PackStatus.ERROR, message: error.message };
    }
  }

  /**
   * Insert PIS data from VIS and return updated PIS list
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-25
   * @param   {string} vis VIS code
   * @param   {string} userId User ID
   * @param   {string} useLocal Local table flag
   * @return  {Promise<PackResultDto>} Item DTO
   */
  async getPISfromVIS(vis: string, userId: string, useLocal: string): Promise<PackResultDto> {
    try {
      const [d] = await this.db.query(
        'EXEC InsertPackingDetail @0,@1,@2',
        [vis, useLocal, userId],
      );

      if (d.errstate === '0') {
        return this.listPIS(vis, userId, false);
      }

      return {
        status: PackStatus.INFO,
        message: d.errmsg
      };
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
   * @return  {Promise<PackResultDto>} Item DTO
   */
  async listPIS(vis: string, userId: string, finState: boolean): Promise<PackResultDto> {
    try {
      const rows = await this.db.query(
        'EXEC GetListPIS @0,@1',
        [vis, userId],
      );

      if (!rows || rows.length === 0) {
        return {
          status: PackStatus.INFO,
          message: 'ไม่พบรายการ VPS กรุณาสแกน VIS ใหม่อีกครั้ง',
        };
      }

      const items = rows.map((r: any) => ({
        ordernoref: r.ordernoref,
        iteminfo: r.iteminfo,
        checksta: r.checksta === "1",
        vpscode: r.ordernoref.substring(1, 8) + r.iteminfo.replace(' #', ''),
      }));

      return {
        status: PackStatus.SUCCESS,
        message: '',
        chkcompte: finState,
        items,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Keep SQL error log (converted from .NET KeepSqlErr)
   * @author  Mr.Pathanapong Sokpukeaw
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
        ErrDate: () => 'GETDATE()',
      });
    } catch (error) {
      // console.error('keepSqlErr failed:', error);
    }
  }

  /**
   * Validate PIS detail and save into packing table
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-12-17
   * @param   {string} vis VIS code
   * @param   {string} pis PIS code
   * @param   {string} userId User ID
   * @return  {Promise<PackResultDto>} Item DTO
   */
  async checkPIS(vis: string, pis: string, userId: string): Promise<PackResultDto> {
    try {
      const [d] = await this.db.query(
        'EXEC SavePISinPacking @0,@1,@2',
        [vis, pis, userId],
      );

      switch (d.errcode) {
        case VisErrCode.OK:
          return { status: PackStatus.SUCCESS, message: d.errmsg, chkcompte: false };
        case VisErrCode.FINISHED:
          return { status: PackStatus.SUCCESS, message: d.errmsg, chkcompte: true };
        default:
          return { status: PackStatus.INFO, message: d.errmsg };
      }
    } catch (error) {
      await this.keepSqlErr('CheckPisDetail', error.message, 1, userId);
      return { status: PackStatus.ERROR, message: error.message };
    }
  }

  /**
   * Check shipping mark before closing VIS (final step of packing)
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-12-12
   * @param   {string} vis VIS code
   * @param   {string} shipcode Shipping mark code
   * @param   {string} userId User ID
   * @return  {Promise<PackResultDto>} Item DTO
   */
  async checkCloseVIS(vis: string, shipcode: string, userId: string): Promise<PackResultDto> {
    try {
      const [d] = await this.db.query(
        'EXEC CheckBcForCloseVIS @0,@1,@2',
        [vis, shipcode, userId],
      );

      if (d.code === '1') {
        return this.visCheckComplate(vis, userId);
      }

      return {
        status: PackStatus.INFO,
        message: d.msge
      };
    } catch (error) {
      return { status: PackStatus.ERROR, message: 'CheckCloseVIS failed: ' + error.message };
    }
  }

  /**
   * Check VIS before completing packing process (final validation)
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-25
   * @param   {string} vis VIS code
   * @param   {string} userId User ID
   * @return  {Promise<PackResultDto>} Item DTO
   */
  async visCheckComplate(vis: string, userId: string): Promise<PackResultDto> {
    try {
      const [d] = await this.db.query(
        'EXEC CheckVIScompte @0,@1',
        [vis, userId],
      );

      return {
        status: d.errcode === '0' ? PackStatus.SUCCESS : PackStatus.INFO,
        message: d.errmsg,
      };
    } catch (error) {
      await this.keepSqlErr('VISCheckCompte', error.message, 1, userId);
      return { status: PackStatus.ERROR, message: error.message };
    }
  }

  /**
   * Check if VIS contains lost items before allowing complete process
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-25
   * @param   {string} vis VIS code
   * @param   {string} userId User ID
   * @return  {Promise<PackResultDto>} Item DTO
   */
  async getLostItem(vis: string, userId: string): Promise<PackResultDto> {
    try {
      const [d] = await this.db.query(
        'EXEC CheckLostItem @0,@1',
        [vis, userId],
      );

      return {
        status: d.resultcode === '1' ? PackStatus.SUCCESS : PackStatus.INFO,
        message: d.resultmsg,
      };
    } catch (error) {
      return { status: PackStatus.ERROR, message: 'GetLostItem failed: ' + error.message };
    }
  }
}
