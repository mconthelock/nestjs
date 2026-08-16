import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'TAGS', schema: 'DOCINV' })
export class Tags {
    @PrimaryGeneratedColumn({ name: 'TAG_ID' })
    TAG_ID: number;

    @Column({ name: 'TAG_NAME' })
    TAG_NAME: string;

    @Column({ name: 'TAG_STYLE' })
    TAG_STYLE: string;
}
