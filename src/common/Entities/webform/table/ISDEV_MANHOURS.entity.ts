import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ISDEV_MANHOURS', schema: 'WEBFORM' })
export class ISDEV_MANHOURS {
    @PrimaryGeneratedColumn()
    CATEGORY_ID: number;

    @Column()
    CATEGORY_NAME: string;

    @Column()
    CATEGORY_STATUS: string;
}
