import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from 'src/common/Entities/amec/views/user.entity';
@Entity({ name: 'JOP_PUR_CONF', schema: 'DAILYIDS' })
export class JopPurConf {
    JOP_REVISION_TEXT?: string;
    @PrimaryColumn()
    JOP_REVISION: number;

    @PrimaryColumn()
    JOP_MFGNO: string;

    @PrimaryColumn()
    JOP_PONO: number;

    @PrimaryColumn()
    JOP_LINENO: number;

    @Column()
    JOP_PUR_CONFIRM: string;

    @Column()
    JOP_PUR_CONFIRM_DATE: Date;

    @Column()
    JOP_PUR_INPUT_DATE: Date;

    @Column()
    JOP_PUR_REMARK: string;

    @ManyToOne(() => User, (user) => user.jopPurConf)
    @JoinColumn({ name: 'JOP_PUR_CONFIRM', referencedColumnName: 'SEMPNO' })
    purConfirm: User | null;
}
