import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('IDTAGS_PAGES')
export class IdtagPages {
    @PrimaryColumn()
    FILES_ID: number;

    @PrimaryColumn()
    PAGE_NUM: number;

    @Column()
    PAGE_TAG: string;

    @Column()
    PAGE_STATUS: string;
}
