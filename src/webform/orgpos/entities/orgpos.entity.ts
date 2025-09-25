import { User } from 'src/amec/users/entities/user.entity';
import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity('ORGPOS')
export class Orgpos {
    @PrimaryColumn()
    VPOSNO: string;

    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    VEMPNO: string;

    @OneToOne(() => User, (u) => u.orgpos)
    @JoinColumn({ name: 'VEMPNO', referencedColumnName: 'SEMPNO' })
    EMPINFO: User;
}
