import { Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from 'src/amec/users/entities/user.entity';

@Entity({ name: 'ORGPOS', schema: 'WEBFORM' })
export class ORGPOS {
    @PrimaryColumn()
    VPOSNO: string;

    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    VEMPNO: string;

    @OneToOne(() => User, (u) => u.ORGPOS)
    @JoinColumn({ name: 'VEMPNO', referencedColumnName: 'SEMPNO' })
    EMPINFO: User;
}
