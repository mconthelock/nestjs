import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'Q90010P2',
    schema: 'ESCCHKSHT',
})
export class Q90010P2 {
    @PrimaryColumn()
    Q9ORD: string;

    @Column()
    Q9TYP: string;
}