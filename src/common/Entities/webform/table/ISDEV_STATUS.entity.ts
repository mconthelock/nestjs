import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ISDEV_STATUS', schema: 'WEBFORM' })
export class ISDEV_STATUS {
    @PrimaryGeneratedColumn()
    STATUS_ID: number;

    @Column()
    STATUS_ACTION: string;

    @Column()
    STATUS_DESC: string;

    @Column()
    STATUS_CLASS: string;
}
