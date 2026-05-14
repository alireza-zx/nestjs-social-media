import { Message } from "src/messages/message.entity";
import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['user1', 'user2'])
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @ManyToOne(() => User, (user) => user.conversations1, {
    eager: true,
    onDelete: "CASCADE"
  })
  user1: User;

  @ManyToOne(() => User, (user) => user.conversations2, {
    eager: true,
    onDelete: "CASCADE"
  })
  user2: User;

  @Column({
    type: 'boolean',
    default: false
  })
  isGroup: boolean;

  @CreateDateColumn()
  createdAt: Date;
}