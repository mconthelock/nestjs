import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { PURNVF_FORM } from './PURNVF_FORM.entity';
import { PTERMCODE } from '../../amec/table/PTERMCODE.entity';

@Entity({ name: 'PURNVF_LIST', schema: 'WEBFORM' })
export class PURNVF_LIST {
    @PrimaryColumn()
    NFRMNO: number;

    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    CYEAR: string;

    @PrimaryColumn()
    CYEAR2: string;

    @PrimaryColumn()
    NRUNNO: number;

    @PrimaryColumn()
    LID: number;

    @Column()
    PURPOSE: string;

    @Column()
    TYPEJOB: string;

    @Column()
    SERVICE: string;

    @Column()
    REASON: string;

    @Column()
    VENDCODE: string;

    @Column()
    VENDTYPE: string;

    @Column()
    COMNAME: string;

    @Column()
    CONTACT: string;

    @Column()
    EMAIL: string;

    @Column()
    WEBSITE: string;

    @Column()
    TELNO: string;

    @Column()
    FAX: string;

    @Column()
    BANKNAME: string;

    @Column()
    BRANCH: string;

    @Column()
    ACCNUMBER: string;

    @Column()
    TERMCODE : string;
    

  @ManyToOne(() => PURNVF_FORM, (nvf) => nvf.LISTS)
  @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO' })
  @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO' })
  @JoinColumn({ name: 'CYEAR', referencedColumnName: 'CYEAR' })
  @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
  @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
  MASTER_NVFLIST: PURNVF_FORM;

  @OneToOne(() => PTERMCODE)
  @JoinColumn({ name: 'TERMCODE', referencedColumnName: 'STERMCODE' })
  TERM: PTERMCODE;  
}
