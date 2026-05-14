import { User } from "../users/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false
  })
  token: string;
  
  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'timestamp',
    nullable: false
  })
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.sessions, {
    // this will remove records on this table that are related to user table, when a user gets deleted
    onDelete: 'CASCADE'
  })
  user: User;
}