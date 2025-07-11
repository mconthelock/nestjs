import { User } from 'src/amec/users/entities/user.entity';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('JOP_REQ')
export class SetRequestDate {
  JOP_REVISION_TEXT?: string; // Optional, will be set later
  DeadLinePUR?: Number;

  @PrimaryColumn()
  JOP_REVISION: number;

  @PrimaryColumn()
  JOP_MFGNO: string;

  //   @PrimaryColumn()
  //   JOP_RQS: string;

  @PrimaryColumn()
  JOP_PONO: number;

  @PrimaryColumn()
  JOP_LINENO: number;

  @Column()
  JOP_PUR_STATUS: number | 0;

  //   margeting

  @Column()
  JOP_MAR_REQUEST: string | null;

  @Column()
  JOP_MAR_REQUEST_DATE: Date | null;

  @Column()
  JOP_MAR_INPUT_DATE: Date | null;

  @Column()
  JOP_MAR_REMARK: string | null;

  //   purchase
  @Column()
  JOP_PUR_CONFIRM: string | null;

  @Column()
  JOP_PUR_CONFIRM_DATE: Date | null;

  @Column()
  JOP_PUR_INPUT_DATE: Date | null;

  @Column()
  JOP_PUR_REMARK: string | null;

  @ManyToOne(() => User, (user) => user.SEMPNO)
  @JoinColumn({ name: 'JOP_MAR_REQUEST', referencedColumnName: 'SEMPNO' })
  marRequest: User | null;

  @ManyToOne(() => User, (user) => user.SEMPNO)
  @JoinColumn({ name: 'JOP_PUR_CONFIRM', referencedColumnName: 'SEMPNO' })
  purConfirm: User | null;
}
//------------------------------------------------------
//    @PrimaryColumn()
//   JOP_PONO: number;

//   @PrimaryColumn()
//   JOP_LINENO: number;

//   @Column()
//   JOP_PUR_STATUS: number | null;

//   @Column()
//   JOP_REQUESTDATE: Date | null;

//   @Column()
//   JOP_USERCREATE: string | null;

//   @Column()
//   JOP_CREATEDATE: Date | null;

//   @Column()
//   JOP_USERUPDATE: string | null;

//   @Column()
//   JOP_UPDATEDATE: Date | null;

//--------------------------------------------------------
// import { User } from 'src/amec/users/entities/user.entity';

// import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// @Entity('JOP_REQ')
// export class SetRequestDate {
//   @PrimaryColumn({ type: 'number' })
//   JOP_REVISION: number;

//   JOP_REVISION_TEXT?: string; // Optional, will be set later
//   DeadLinePUR?: Number;

//   @PrimaryColumn({ type: 'varchar', length: 64 })
//   JOP_MFGNO: string;

//   //   @PrimaryColumn()
//   //   JOP_RQS: string;

//   @PrimaryColumn({ type: 'number' })
//   JOP_PONO: number;

//   @PrimaryColumn({ type: 'number' })
//   JOP_LINENO: number;

//   @Column({ type: 'number', default: 0 })
//   JOP_PUR_STATUS: number;

//   //   margeting

//   @Column({ type: 'varchar', length: 8, nullable: true })
//   JOP_MAR_REQUEST: string | null;

//   @Column({ type: 'date', nullable: true })
//   JOP_MAR_REQUEST_DATE: Date | null;

//   @Column({ type: 'date', nullable: true })
//   JOP_MAR_INPUT_DATE: Date | null;

//   @Column({ type: 'varchar', length: 2000, nullable: true })
//   JOP_MAR_REMARK: string | null;

//   //   purchase
//   @Column({ type: 'varchar', length: 8, nullable: true })
//   JOP_PUR_CONFIRM: string | null;

//   @Column({ type: 'date', nullable: true })
//   JOP_PUR_CONFIRM_DATE: Date | null;

//   @Column({ type: 'date', nullable: true })
//   JOP_PUR_INPUT_DATE: Date | null;

//   @Column({ type: 'varchar', length: 2000, nullable: true })
//   JOP_PUR_REMARK: string | null;

//   @ManyToOne(() => User, (user) => user.SEMPNO)
//   @JoinColumn({ name: 'JOP_MAR_REQUEST', referencedColumnName: 'SEMPNO' })
//   marRequest: User | null;

//   @ManyToOne(() => User, (user) => user.SEMPNO)
//   @JoinColumn({ name: 'JOP_PUR_CONFIRM', referencedColumnName: 'SEMPNO' })
//   purConfirm: User | null;

//   //   @ManyToOne(() => VOrderList, (v) => v.REVISION)
//   //   @JoinColumn([
//   //     { name: 'JOP_MFGNO', referencedColumnName: 'MFGNO' },
//   //     { name: 'JOP_PONO', referencedColumnName: 'PONO' },
//   //     { name: 'JOP_LINENO', referencedColumnName: 'LINENO' }
//   //   ])
//   //   REVISION: VOrderList | null;

//   //    @PrimaryColumn()
//   //   JOP_PONO: number;

//   //   @PrimaryColumn()
//   //   JOP_LINENO: number;

//   //   @Column()
//   //   JOP_PUR_STATUS: number | null;

//   //   @Column()
//   //   JOP_REQUESTDATE: Date | null;

//   //   @Column()
//   //   JOP_USERCREATE: string | null;

//   //   @Column()
//   //   JOP_CREATEDATE: Date | null;

//   //   @Column()
//   //   JOP_USERUPDATE: string | null;

//   //   @Column()
//   //   JOP_UPDATEDATE: Date | null;
// }
