import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { QainsForm } from '../../qa-ins/qains_form/entities/qains_form.entity';
import { QaType } from '../../qa_type/entities/qa_type.entity';

@Entity('QA_FILE')
export class QaFile {
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
  FILE_TYPECODE: string;

  @PrimaryColumn()
  FILE_ID: number;

  @Column()
  FILE_ONAME: string;

  @Column()
  FILE_FNAME: string;

  @Column()
  FILE_USERCREATE: string;

  @Column()
  FILE_DATECREATE: Date;

  @Column()
  FILE_USERUPDATE: string;

  @Column()
  FILE_DATEUPDATE: Date;

  @Column()
  FILE_STATUS: number;

  @Column()
  FILE_PATH: string;

  @ManyToOne(() => QainsForm, (form) => form.QA_FILES)
  @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO' })
  @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO' })
  @JoinColumn({ name: 'CYEAR', referencedColumnName: 'CYEAR' })
  @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
  @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
  QAINSFORM: QainsForm | null;

  @ManyToOne(() => QaType, (t) => t.FILE_TYPE)
  @JoinColumn({ name: 'FILE_TYPECODE', referencedColumnName: 'QAT_CODE' })
  TYPE: QaType | null;
}
