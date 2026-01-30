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
        private readonly logdb: Repository<PAccessLog>,

        @InjectDataSource('packingConnection')
        private readonly db: DataSource,
    ) {}

    /**
     * Generate unique log ID
     * @author  Mr.Pathanapong Sokpukeaw
     * @since   2025-11-13
     * @return  {string} Unique log ID: f742a825-0dab-4165-a3e9-27b6ec6b014c-20251126094545
     */
    generateLogId(): string {
        const now  = new Date();
        const yyyy = now.getFullYear().toString();
        const mm  = (now.getMonth() + 1).toString().padStart(2, '0');
        const dd  = now.getDate().toString().padStart(2, '0');
        const hh  = now.getHours().toString().padStart(2, '0');
        const min = now.getMinutes().toString().padStart(2, '0');
        const ss  = now.getSeconds().toString().padStart(2, '0');
        const timestamp = `${yyyy}${mm}${dd}${hh}${min}${ss}`;
        const uuid = randomUUID();
        return `${uuid}-${timestamp}`.substring(0, 50);
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
            const [d] = await this.db.query(
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
            const user: PackLoginUserDto = { userId, userName, useLocaltb, sessionId };
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
            await this.logdb.createQueryBuilder()
                .update(PAccessLog)
                .set({ endtime: () => 'GETDATE()' })
                .where('usrid = :userId AND accessid = :sessionId', { userId, sessionId })
                .execute();
        } catch (error) {
            throw new InternalServerErrorException('Error updating logout log: ' + error.message);
        }
    }
}
