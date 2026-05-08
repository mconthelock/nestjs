import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('SCM_DAILY_APP_LOG')
export class ScmappLog {
    @PrimaryColumn()
    LOG_DATE: Date;

    @PrimaryColumn()
    LOG_TIME: string;

    @Column()
    LOG_USER: string;

    @Column()
    LOG_USERNAME: string;

    @Column()
    LOG_DOMAIN: string;

    @Column()
    LOG_HOST: string;

    @Column()
    LOG_IP: string;

    @Column()
    LOG_LOGIN_STATUS: string;
}
