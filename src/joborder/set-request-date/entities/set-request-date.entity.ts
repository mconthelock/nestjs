import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity('JOP_REQ')
export class SetRequestDate {
  @PrimaryColumn()
  JOP_PONO: number;

  @PrimaryColumn()
  JOP_LINENO: number;

  @Column()
  JOP_PUR_STATUS: number | null;
  
  @Column()
  JOP_REQUESTDATE: Date | null;

  @Column()
  JOP_USERCREATE: string | null;


  @Column()
  JOP_CREATEDATE: Date | null;

  @Column()
  JOP_USERUPDATE: string | null;

  @Column()
  JOP_UPDATEDATE: Date | null;

}
