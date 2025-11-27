import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { F001KP } from '../../../as400/shopf/f001kp/entities/f001kp.entity';
@Entity({ name: 'F110KP', schema: 'AMECMFG' })
export class F110KP {
  @PrimaryColumn()
  F11K01: string;

  @Column()
  F11K02: string;

  @Column()
  F11K03: string;

  @Column()
  F11K04: string;

  @Column()
  F11K05: string;

  @Column()
  F11K06: string;

  @Column()
  F11K07: string;

  @Column()
  F11K08: string;

  @Column()
  F11K09: string;

  @Column()
  F11K10: string;

  @Column()
  F11K11: string;

  @Column()
  F11K12: string;

  @Column()
  F11K13: string;

  @Column()
  F11K14: string;

  @Column()
  F11K15: string;

  @Column()
  F11K16: string;

  @Column()
  F11K17: string;

  @Column()
  F11K18: string;

  @Column()
  F11K19: string;

  @Column()
  F11K20: string;

  @Column()
  F11K21: string;

  @Column()
  F11K22: string;

  @Column()
  F11K23: string;

  @Column()
  F11K24: string;

  @Column()
  F11K25: string;

  @Column()
  F11K26: string;

  @Column()
  F11K27: string;

  @Column()
  F11K28: string;

  @Column()
  F11K29: string;

  @Column()
  F11K30: string;

  @Column()
  F11K31: string;

  @Column()
  F11K32: string;

  @Column()
  F11K33: string;

  @Column()
  F11K34: string;

  @Column()
  F11K35: string;

  @Column()
  F11K36: string;

  @Column()
  F11K37: string;

  @Column()
  F11K38: string;

  @Column()
  F11K39: string;

  @Column()
  F11K40: string;

  @Column()
  F11K41: string;

  @Column()
  F11K42: string;

  @Column()
  F11K43: string;

  @Column()
  F11K44: string;

  @Column()
  F11K45: string;

  @Column()
  F11K46: string;

  @Column()
  F11K47: string;

  @Column()
  F11K48: string;

  @Column()
  F11K49: string;

  @Column()
  F11K50: string;

  @Column()
  F11K51: string;

  @Column()
  F11K52: string;

  @Column()
  F11K53: string;

  @Column()
  F11K54: string;

  @Column()
  F11K55: string;

  @Column()
  F11K56: string;

  @Column()
  F11K57: string;

  @Column()
  F11K58: string;

  @Column()
  F11K59: string;

  @Column()
  F11K60: string;

  @Column()
  F11K61: string;

  @Column()
  F11K62: string;

  @Column()
  F11K63: string;

  @Column()
  F11K64: string;

  @Column()
  F11K65: string;

  @Column()
  F11K66: string;

  @Column()
  F11K67: string;

  @Column()
  F11K68: string;

  @Column()
  F11K69: string;

  @Column()
  F11K70: string;

  @Column()
  F11K71: string;

  @Column()
  F11K72: string;

  @Column()
  F11K73: string;

  @Column()
  F11K74: string;

  @Column()
  F11K75: string;

  @Column()
  F11K76: string;

  @Column()
  F11K77: string;

  @Column()
  F11K78: string;

  @Column()
  F11K79: string;

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  // @ManyToOne(() => User, user => user.posts)
  // user: User;

  @ManyToOne(() => F001KP, (f1) => f1.detail)
  @JoinColumn([{ name: 'F11K01', referencedColumnName: 'F01R01' }])
  tags: F001KP;
}
