//MHMEML00: Email ส่วนตัว
import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity({ name: 'MHMEML00', schema: 'GPREPORT' })
export class MHMEML00 {
    @PrimaryColumn()
    MEMCOD: string;

    @Column()
    MEMEML: string;
}
