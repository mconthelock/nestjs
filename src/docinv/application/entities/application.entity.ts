import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity('APPLICATION')
export class Application {
  @PrimaryColumn({ name: 'APP_ID', type: 'number' })
  appid: number;

  @Column({ name: 'APP_NAME' })
  appname: string;

  @Column({ name: 'APP_LOCATION' })
  applocation: string;

  // @Column({name: "APP_PIC1"})
  // @Column({name: "APP_PIC2"})
  // @Column({name: "APP_ITGC"})
  // @Column({name: "APP_CODE"})
  // @Column({name: "APP_DESCRIPTION"})
  // @Column({name: "APP_STATUS"})
  // @Column({name: "APP_UPDATE"})
  // @Column({name: "APP_UPDATEBY"})
  // @Column({name: "APP_REVISION"})
  // @Column({name: "APP_SERVER"})
  // @Column({name: "APP_RLS1"})
  // @Column({name: "APP_RLS2"})
  // @Column({name: "APP_NO"})
  // @Column({name: "APP_LOGIN"})
}
