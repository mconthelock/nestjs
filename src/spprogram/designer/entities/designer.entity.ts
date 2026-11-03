import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from 'src/amec/users/entities/user.entity';

@Entity({ name: 'SP_DESIGNER', schema: 'SPSYS' })
export class Designer {
  @PrimaryColumn()
  DES_USER: string;

  @Column()
  DES_GROUP: string;

  @Column()
  DES_ENGINEER: string;

  @Column()
  DES_CHECKER: string;

  @OneToOne(() => User, (user) => user.spdesigner)
  @JoinColumn({ name: 'DES_USER', referencedColumnName: 'SEMPNO' })
  user: User;
}
