import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'FORM_ATTACHMENT_TYPE', schema: 'WEBFORM' })
export class FORM_ATTACHMENT_TYPE {
    @PrimaryGeneratedColumn()
    NID: number;

    @Column()
    VCODE: string;

    @Column()
    VDESCRIPTION: string;
}
