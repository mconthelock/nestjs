import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../webform/views/AMECUSERALL.entity';

@Entity({ name: 'PASSWORD_RESET_TOKENS', schema: 'WEBFORM' })
export class PasswordTokens {
    @PrimaryColumn()
    ID: number;

    @Column()
    USER_ID: string;

    @Column()
    EMAIL: string;

    @Column()
    TOKEN_HASH: string;

    @Column()
    EXPIRES_AT: Date;

    @Column()
    USED_AT: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    CREATED_AT: Date;

    @Column()
    STATUS: string;

    @Column()
    IP_ADDRESS: string;

    @Column()
    USER_AGENT: string;

    @OneToOne(() => User, (user) => user.SEMPNO)
    @JoinColumn({ name: 'USER_ID', referencedColumnName: 'SEMPNO' })
    user: User;
}
