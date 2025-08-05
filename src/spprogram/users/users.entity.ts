import { ChildEntity, OneToMany, JoinColumn } from 'typeorm';
import { User } from 'src/amec/users/entities/user.entity';
import { History } from '../history/entities/history.entity';

@ChildEntity()
export class SpUser extends User {
  @OneToMany(() => History, (hist) => hist.users)
  @JoinColumn({ name: 'SEMPNO', referencedColumnName: 'INQH_USER' })
  history: History;
}
