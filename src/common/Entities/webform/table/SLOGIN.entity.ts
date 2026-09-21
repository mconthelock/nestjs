import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../webform/views/AMECUSERALL.entity';

@Entity({ name: 'SLOGIN', schema: 'WEBFORM' })
export class SLOGIN {
    @PrimaryColumn()
    SEMPNO: string;

    @Column()
    SID: string;

    // @OneToOne(() => User)
    // @JoinColumn({ name: 'SEMPNO', referencedColumnName: 'SEMPNO' })
    // owner: User;
}
