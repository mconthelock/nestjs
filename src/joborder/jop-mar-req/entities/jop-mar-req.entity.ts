import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from 'src/amec/users/entities/user.entity';
@Entity('JOP_MAR_REQ')
export class JopMarReq {
  JOP_REVISION_TEXT?: string; // Optional, will be set later
  DeadLinePUR?: Number;
  
  @PrimaryColumn()
  JOP_REVISION: number;

  @PrimaryColumn()
  JOP_MFGNO: string;

  @PrimaryColumn()
  JOP_PONO: number;

  @PrimaryColumn()
  JOP_LINENO: number;

  @Column()
  JOP_PUR_STATUS: number;

  @Column()
  JOP_MAR_REQUEST: string;

  @Column()
  JOP_MAR_REQUEST_DATE: Date;

  @Column()
  JOP_MAR_INPUT_DATE: Date;

  @Column()
  JOP_MAR_REMARK: string;

  @ManyToOne(() => User, (user) => user.jopMarReq)
  @JoinColumn({ name: 'JOP_MAR_REQUEST', referencedColumnName: 'SEMPNO' })
  marRequest: User | null;
}
