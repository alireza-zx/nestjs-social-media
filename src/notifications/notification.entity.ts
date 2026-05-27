import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false
  })
  description: string;

  @Column({
    type: 'bool',
    default: false
  })
  isRead: boolean;

  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: 'CASCADE'
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}