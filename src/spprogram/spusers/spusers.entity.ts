import { Entity, OneToMany, JoinColumn } from 'typeorm';
import { User } from 'src/amec/users/entities/user.entity';
import { History } from 'src/spprogram/history/entities/history.entity';

@Entity('AMECUSERALL')
export class SpUser extends User {
  @OneToMany(() => History, (inq) => inq.users)
  @JoinColumn({ name: 'SEMPNO', referencedColumnName: 'INQH_USER' })
  sphistory: History;
}
