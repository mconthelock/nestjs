import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from 'src/amec/users/entities/user.entity';

@Entity({ name: 'DWGNOTICEPICMST', schema: 'WEBFORM' })
export class DWGNOTICEPICMST {
    @PrimaryColumn()
    ITEMNO: string;

    @Column()
    SEMPNO: string;

    @Column()
    SEMPNO2: string;

    @Column()
    ITEMNAME: string;

    @OneToOne(() => User)
    @JoinColumn({ name: 'SEMPNO', referencedColumnName: 'SEMPNO' })
    PICINFO: User;
}
