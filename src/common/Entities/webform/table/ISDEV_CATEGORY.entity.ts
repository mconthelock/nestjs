import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ISDEV_CATEGORY', schema: 'WEBFORM', database: 'webform' })
export class ISDEV_CATEGORY {
    @PrimaryGeneratedColumn()
    CATEGORY_ID: number;

    @Column()
    CATEGORY_NAME: string;

    @Column()
    CATEGORY_STATUS: string;
}
