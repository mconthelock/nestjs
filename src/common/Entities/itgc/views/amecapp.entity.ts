import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'APP_LOG_VIEW',
    schema: 'AMEC',
})
export class AmecappLog {
    @PrimaryColumn()
    LOG_DATE: Date;

    @PrimaryColumn()
    LOG_TIME: string;

    @Column()
    LOG_USER: string;

    @Column()
    LOG_DOMAIN: string;

    @Column()
    LOG_HOST: string;

    @Column()
    LOG_IP: string;

    @Column()
    LOG_LOGIN_STATUS: string;
}
