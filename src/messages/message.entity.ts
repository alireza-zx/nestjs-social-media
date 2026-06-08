import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Conversation } from "../conversations/conversation.entity";
import { User } from "../users/user.entity";

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, {
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  sender: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    eager: true,
    onDelete: 'CASCADE'
  })
  conversation: Conversation;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false
  })
  content: string;

  @Column({
    type: 'boolean',
    default: false
  })
  seen: boolean;
  
  @CreateDateColumn()
  createdAt: Date;
}