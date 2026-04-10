import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository, DataSource } from 'typeorm';
import { PAccessLog } from './entities/p-access-log.entity';
import { PackLoginUserDto, PackLoginResponseDto, LoginStatus } from './dto/pack-login-response.dto';

enum AuthErrCode {
    OK = '0',
}

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(PAccessLog, 'packingConnection')
        private readonly logrepo: Repository<PAccessLog>,

        @InjectDataSource('packingConnection')
        private readonly packdb: DataSource,

        @InjectDataSource('workloadConnection')
        private readonly workdb: DataSource,
    ) {}

    /**
     * Generate unique log ID
     * @author  Mr.Pathanapong Sokpukeaw
     * @since   2025-11-13
     * @return  {string} Unique log ID: f742a825-0dab-4165-a3e9-27b6ec6b014c-20251126094545
     */
    generateLogId(): string {
        const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
        return `${randomUUID()}-${timestamp}`.substring(0, 50);
    }

    /**
     * Validate user login via stored procedure and return user info
     * @author  Mr.Pathanapong Sokpukeaw
     * @since   2025-11-13
     * @param   {string} empno Employee ID
     * @param   {string} ip Client IP address
     * @return  {Promise<PackLoginResponseDto>} Login result with status, message, and user info
     */
    async validateUser(empno: string, ip: string): Promise<PackLoginResponseDto> {
        try {
            const sessionId = this.generateLogId();
            const [d] = await this.packdb.query(
                'EXEC ValidatePackAuth @0,@1,@2',
                [empno, ip, sessionId],
            );

            if (d.errcode !== AuthErrCode.OK) {
                return {
                    status: LoginStatus.INFO,
                    message: d.errormsg,
                    user: null,
                };
            }

            const [userId, userName, useLocaltb] = d.errormsg.split('-');
            const hasReprint = await this.checkReprintPermission(empno);
            const user: PackLoginUserDto = { userId, userName, useLocaltb, sessionId, hasReprint };
            return {
                status: LoginStatus.SUCCESS,
                message: 'Login success',
                user,
            };
        } catch (error) {
            throw new InternalServerErrorException('Login error: ' + error.message);
        }
    }

    /**
     * Update logout log in PAccessLog table by setting endtime
     * @author  Mr.Pathanapong Sokpukeaw
     * @since   2025-11-24
     * @param   {string} userId Employee ID
     * @param   {string} sessionId Session ID
     * @return  {Promise<void>}
     */
    async updateLogout(userId: string, sessionId: string): Promise<void> {
        try {
            await this.logrepo.createQueryBuilder()
                .update(PAccessLog)
                .set({ endtime: () => 'GETDATE()' })
                .where('usrid = :userId AND accessid = :sessionId', { userId, sessionId })
                .execute();
        } catch (error) {
            throw new InternalServerErrorException('Error updating logout log: ' + error.message);
        }
    }

    /**
     * Check user permission from reprint
     * @author  Mr.Pathanapong Sokpukeaw
     * @since   2026-04-08
     * @param   {string} empno Employee ID
     * @return  {Promise<boolean>}
     */
    async checkReprintPermission(empno: string): Promise<boolean> {
        try {
            const result = await this.workdb.query(
                `
                 SELECT *
                 FROM VPS_USER_REPRINT 
                 WHERE SEMPNO = '${empno}' 
                    AND STATUS_REPRINT = 1
                `
            );

            return result.length > 0;
        } catch (error) {
            throw new InternalServerErrorException('Error checking reprint permission');
        }
    }
}
