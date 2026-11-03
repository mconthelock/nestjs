import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'IDTAGS_LIST', schema: 'WORKLOAD' })
export class IdtagList {
    @PrimaryColumn()
    MST_DIR: string;

    @PrimaryColumn()
    MST_FILE: string;

    @Column()
    MST_STATUS: string;
}
