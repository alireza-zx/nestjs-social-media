import { User } from "../users/user.entity";
import { Post } from "../posts/post.entity";
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['user', 'post'])
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Post, (post) => post.likes, {
    onDelete: 'CASCADE'
  })
  post: Post;

  @ManyToOne(() => User, (user) => user.likes, {
    onDelete: 'CASCADE'
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}