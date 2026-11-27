import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ISDEV_TYPE', schema: 'WEBFORM', database: 'webform' })
export class ISDEV_TYPE {
    @PrimaryGeneratedColumn()
    TYPE_ID: number;

    @Column()
    TYPE_DESC: string;

    @Column()
    TYPE_GROUP: string;
}
