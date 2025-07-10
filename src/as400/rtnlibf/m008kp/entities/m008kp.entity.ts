export class M008kp {
  @Column()
  M8K01: string;

  @Column()
  M8K02: string;

  @Column()
  M8K03: string;

  @Column()
  M8K04: string;

  @OneToOne(() => Q90010P2, (q9) => q9.bmorder)
  @JoinColumn([{ name: 'M08K03', referencedColumnName: 'Q9ORD' }])
  bmdate: Q90010P2;
}
