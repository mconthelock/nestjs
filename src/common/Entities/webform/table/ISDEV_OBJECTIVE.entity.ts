import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ISDEV_OBJECTIVE', schema: 'WEBFORM' })
export class ISDEV_OBJECTIVE {
    @PrimaryGeneratedColumn()
    OBJ_ID: number;

    @Column()
    OBJ_NAME: string;

    @Column()
    OBJ_STATUS: string;
}
