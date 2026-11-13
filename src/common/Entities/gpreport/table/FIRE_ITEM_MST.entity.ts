import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'FIRE_ITEM_MST', schema: 'GPREPORT' })
export class FireItemMst {
  @PrimaryColumn({ type: 'varchar2', length: 20 })
  FIRE_CODE: string;

  @Column({ type: 'varchar2', length: 100, nullable: true })
  LOCATION: string | null;

  @Column({ type: 'varchar2', length: 100, nullable: true })
  FTYPE: string | null;

  @Column({ type: 'varchar2', length: 100, nullable: true })
  CAPACITY: string | null;

  @Column({ type: 'varchar2', length: 100, nullable: true })
  AREA: string | null;

  @Column({ type: 'char', length: 1, nullable: true })
  STATUS: string | null;
}
