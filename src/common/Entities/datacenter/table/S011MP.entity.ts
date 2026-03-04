import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'S011MP', schema: 'AMECMFG' })
export class S011MP {
  @PrimaryColumn()
  S11M01: string;

  @Column()
  S11M02: string;

  @Column()
  S11M03: string;

  @Column()
  S11M04: string;

  @Column()
  S11M05: string;

  @Column()
  S11M06: string;

  @Column()
  S11M07: string;

  @Column()
  S11M08: string;

  @Column()
  S11M09: string;
}
