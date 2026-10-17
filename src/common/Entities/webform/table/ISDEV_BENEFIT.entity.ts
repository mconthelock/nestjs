import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ISDEV_BENEFIT', schema: 'WEBFORM' })
export class ISDEV_BENEFIT {
    @PrimaryGeneratedColumn()
    CATEGORY_ID: number;

    @Column()
    CATEGORY_NAME: string;

    @Column()
    CATEGORY_STATUS: string;
}
