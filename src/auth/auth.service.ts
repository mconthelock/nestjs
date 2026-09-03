// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/common/services/mail/mail.service';

import { UsersService } from '../amec/users/users.service';
import { AppsusersService } from '../docinv/appsusers/appsusers.service';
import { AppsmenuusersService } from '../docinv/appsmenuusers/appsmenuusers.service';
import { AccesslogService } from '../docinv/accesslog/accesslog.service';
import { CreateResetPasswordDto } from './dto/create-reset-password.dto';

import { PasswordTokens } from 'src/common/Entities/webform/table/PASSWORD_RESET_TOKENS.entity';
import { SequenceOrgService } from 'src/webform/sequence-org/sequence-org.service';

interface logData {
    loguser: string;
    logip: string;
    logstatus: number;
    logprogram: number;
    logmsg: string;
}

@Injectable()
export class AuthService {
    constructor(
        private UsersService: UsersService,
        private Appsuser: AppsusersService,
        private Appsmenu: AppsmenuusersService,
        private logs: AccesslogService,
        private jwtService: JwtService,
        @InjectRepository(PasswordTokens, 'webformConnection')
        private readonly pwd: Repository<PasswordTokens>,
        private readonly mailService: MailService,
        private readonly seqno: SequenceOrgService,
    ) {}

    async login(user: any) {
        const payload = {
            user: user.payload,
            sub: user.sempno,
        };
        return {
            access_token: this.jwtService.sign(payload), //expiresIn: 3600,
            info: user,
        };
    }

    async validateUser(
        username: string,
        pass: string,
        apps: number,
        ip: string,
    ) {
        const log: logData = {
            loguser: username,
            logip: ip,
            logstatus: 0,
            logprogram: apps,
            logmsg: 'Username is not found',
        };
        const user = await this.UsersService.findEmp(username);
        if (!user || user.CSTATUS == '0') {
            this.logs.create(log);
            throw new UnauthorizedException('You nave no authorization 1');
        }

        const md5Hash = crypto.createHash('md5').update(pass).digest('hex');
        if (md5Hash != user.SPASSWORD1 && process.env.STATE == 'production') {
            log.logmsg = 'Password is mismatch';
            this.logs.create(log);
            throw new UnauthorizedException('You nave no authorization 2');
        }

        const validUser = await this.Appsuser.verifyLogin(username, apps);
        if (!validUser) {
            log.logmsg = 'User has no permission';
            this.logs.create(log);
            throw new UnauthorizedException('You nave no authorization 3');
        }
        const auth = await this.getAuthenlist(apps, validUser.group.GROUP_ID);
        log.logstatus = 1;
        log.logmsg = 'Logging in successful';
        this.logs.create(log);

        const appuser = await this.setUser(user);
        return {
            payload: {
                users: user.SEMPNO,
                group: validUser.group.GROUP_ID,
                apps: validUser.application.APP_ID,
                location: validUser.application.APP_LOCATION,
            },
            apps: validUser.application,
            appuser: appuser,
            appgroup: validUser.group,
            auth: auth,
        };
    }

    async getAuthenlist(program: number, group: number) {
        const menulist = await this.Appsmenu.getUserMenu(program, group);
        let mainmenu = [];
        menulist.find((val) => {
            if (val.Appsmenu != null && val.Appsmenu.MENU_TYPE == 1) {
                mainmenu.push({
                    menu_id: val.Appsmenu.MENU_ID,
                    menu_name: val.Appsmenu.MENU_DISPLAY,
                    menu_class: val.Appsmenu.MENU_CLASS,
                    menu_top: val.Appsmenu.MENU_TOP,
                    menu_link: val.Appsmenu.MENU_LINK,
                    menu_icon: val.Appsmenu.MENU_ICON,
                    menu_tname: val.Appsmenu.MENU_TNAME,
                });
            }
        });
        mainmenu.find((val) => {
            menulist.map((mn) => {
                if (
                    mn.Appsmenu.MENU_TOP == val.menu_id &&
                    mn.Appsmenu.MENU_TYPE == 2
                ) {
                    if (!val.submenu) {
                        val.submenu = [];
                    }
                    val.submenu.push({
                        menu_id: mn.Appsmenu.MENU_ID,
                        menu_name: mn.Appsmenu.MENU_DISPLAY,
                        menu_class: mn.Appsmenu.MENU_CLASS,
                        menu_top: mn.Appsmenu.MENU_TOP,
                        menu_link: mn.Appsmenu.MENU_LINK,
                        menu_icon: mn.Appsmenu.MENU_ICON,
                        menu_tname: mn.Appsmenu.MENU_TNAME,
                    });
                }
            });
        });
        return mainmenu;
    }

    async directLogin(username: string, apps: number, ip: string) {
        const log: logData = {
            loguser: username,
            logip: ip,
            logstatus: 0,
            logprogram: apps,
            logmsg: 'Username is not found',
        };
        const user = await this.UsersService.findEmpEncode(username);
        if (!user) {
            log.loguser = null;
            this.logs.create(log);
            throw new UnauthorizedException('You nave no authorization');
        }

        log.loguser = user.SEMPNO;
        if (user.CSTATUS == '0') {
            this.logs.create(log);
            throw new UnauthorizedException('You nave no authorization');
        }

        const validUser = await this.Appsuser.verifyLogin(user.SEMPNO, apps);
        if (!validUser) {
            log.logmsg = 'User has no permission';
            this.logs.create(log);
            throw new UnauthorizedException('You nave no authorization');
        }

        const auth = await this.getAuthenlist(apps, validUser.group.GROUP_ID);
        log.logstatus = 1;
        log.logmsg = 'Logging in successful';
        this.logs.create(log);

        const appuser = await this.setUser(user);
        return {
            payload: {
                users: user.SEMPNO,
                group: validUser.group.GROUP_ID,
                apps: validUser.application.APP_ID,
                location: validUser.application.APP_LOCATION,
            },
            apps: validUser.application,
            appuser: appuser,
            appgroup: validUser.group,
            auth: auth,
        };
    }

    async setUser(user) {
        let imageUrl = ``;
        try {
            const response = await fetch(
                `http://webflow/images/emp/${user.SEMPNO}.jpg`,
            );
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            imageUrl = `data:image/jpeg;base64,${buffer.toString('base64')}`;
        } catch (error) {}
        return {
            SEMPNO: user.SEMPNO,
            SNAME: user.SNAME,
            SRECMAIL: user.SRECMAIL,
            SSECCODE: user.SSECCODE,
            SSEC: user.SSEC,
            SDEPCODE: user.SDEPCODE,
            SDEPT: user.SDEPT,
            SDIVCODE: user.SDIVCODE,
            SDIV: user.SDIV,
            SPOSCODE: user.SPOSCODE,
            SPOSNAME: user.SPOSNAME,
            STNAME: user.STNAME,
            MEMEML: user.MEMEML,
            image: imageUrl,
        };
    }

    async resetPassword(dto: CreateResetPasswordDto) {
        const user = await this.UsersService.findEmp(dto.USER_ID);
        if (!user) {
            throw new Error(`User ${dto.USER_ID} not found`);
        }

        let sendAddress = user.SRECMAIL?.trim();
        if (!sendAddress) {
            let currentEmpNo = user.SEMPNO;
            while (!sendAddress) {
                const managers = await this.seqno.getManager(currentEmpNo);
                const currentUser = await this.UsersService.findEmp(
                    managers?.[0]?.HEADNO,
                );
                if (currentUser?.SRECMAIL?.trim()) {
                    sendAddress = currentUser.SRECMAIL.trim();
                    break;
                }
                currentEmpNo = managers?.[0]?.HEADNO;
                if (!currentEmpNo) {
                    break;
                }
            }
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
        const appBaseUrl = (
            process.env.APP_FORM ||
            process.env.APP_HOST ||
            'http://localhost:3001'
        ).replace(/\/$/, '');
        const resetLink = `${appBaseUrl}/authen/resetpassword?token=${resetToken}`;

        const now = new Date();
        await this.pwd
            .createQueryBuilder()
            .update(PasswordTokens)
            .set({
                USED_AT: now,
                STATUS: 'expired',
                EXPIRES_AT: now,
            })
            .where('USER_ID = :userId', { userId: dto.USER_ID })
            .andWhere('USED_AT IS NULL')
            .andWhere('EXPIRES_AT IS NULL OR EXPIRES_AT > :now', { now })
            .execute();

        await this.pwd.save({
            USER_ID: dto.USER_ID,
            EMAIL: sendAddress,
            TOKEN_HASH: resetToken,
            EXPIRES_AT: resetTokenExpiresAt,
            STATUS: 'pending',
            IP_ADDRESS: dto.IP_ADDRESS,
            USER_AGENT: dto.USER_AGENT,
        });

        const recipientName = user.SNAME || user.STNAME || dto.USER_ID;
        const recipientThaiName = user.STNAME || user.SNAME || dto.USER_ID;
        const recipientEmail = sendAddress || process.env.MAIL_ADMIN;

        await this.sendEmailReset({
            subject: 'Password Reset Request',
            recipientName,
            recipientThaiName,
            recipientEmail,
            resetLink,
            expiresAt: resetTokenExpiresAt.toLocaleString(),
        });

        return {
            status: true,
            message: 'Password reset email sent',
            email: recipientEmail,
            expiresAt: resetTokenExpiresAt,
        };
    }

    private async sendEmailReset(data?: any) {
        const recipientEmail = data?.recipientEmail || process.env.MAIL_ADMIN;
        const resetLink =
            data?.resetLink ||
            `${process.env.APP_ENV || process.env.APP_HOST || 'http://localhost:3001'}/reset-password?token=demo`;

        try {
            await this.mailService.sendMail({
                template: 'auth/reset-password',
                from: `System Admin <${process.env.MAIL_FROM}>`,
                // to: recipientEmail,
                to: `chalorms@MitsubishiElevatorAsia.co.th`,
                subject: data?.subject || 'Password Reset Request',
                context: {
                    recipientName: data?.recipientName || 'All Concerned',
                    recipientThaiName:
                        data?.recipientThaiName || 'ผู้เกี่ยวข้องทุกท่าน',
                    resetLink,
                    expiresAt:
                        data?.expiresAt ||
                        new Date(Date.now() + 60 * 60 * 1000).toLocaleString(),
                    companyName: 'AMEC Webflow System',
                },
            });
            return true;
        } catch (error) {
            await this.mailService.sendMail({
                from: `SP Program <${process.env.MAIL_FROM}>`,
                to: process.env.MAIL_ADMIN,
                subject: 'Error in ST-INP Mail Alert Job',
                html: `<b>An error occurred while executing the ST-INP mail alert job:</b>
                <p>${error.message}</p>
                <br>
                <b>Stack Trace:</b>
                <p>${error.stack}</p>`,
            });
            throw new Error(`Failed to alert: ${error.message}`);
        }
    }
}
