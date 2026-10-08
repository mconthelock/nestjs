import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'S011MP', schema: 'AMECMFG' })
export class S011MP {
  @PrimaryColumn()
  S11M01: string;

  @PrimaryColumn()
  S11M02: string;

  @PrimaryColumn()
  S11M03: string;

  @PrimaryColumn()
  S11M04: string;

  @PrimaryColumn()
  S11M05: string;

  @PrimaryColumn()
  S11M06: string;

  @PrimaryColumn()
  S11M07: string;

  @PrimaryColumn()
  S11M08: string;

  @PrimaryColumn()
  S11M09: number;
}
