import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('SCM_DAILY_DB_LOG')
export class scmdbLog {
    @PrimaryColumn()
    LOG_DATE: Date;

    @PrimaryColumn()
    LOG_TIME: string;

    @PrimaryColumn()
    LOG_SERVER: string;

    @Column()
    LOG_USER: string;

    @Column()
    LOG_DOMAIN: string;

    @Column()
    LOG_HOST: string;

    @Column()
    LOG_IP: string;

    @Column()
    LOG_MSG: string;
}
