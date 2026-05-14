import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class EmailVerificationCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'int',
    nullable: false
  })
  code: number;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true
  })
  email: string;

  @Column({
    type: 'timestamp',
    default: new Date(Date.now() + 5 * 60 * 1000)
  })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}