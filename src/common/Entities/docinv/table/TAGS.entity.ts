import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'TAGS', schema: 'DOCINV' })
export class Tags {
    @PrimaryGeneratedColumn()
    TAG_ID: number;

    @Column()
    TAG_NAME: string;

    @Column()
    TAG_STYLE: string;
}
