import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('IDTAGS_LIST')
export class IdtagList {
    @PrimaryColumn()
    MST_DIR: string;

    @PrimaryColumn()
    MST_FILE: string;

    @Column()
    MST_STATUS: string;
}
