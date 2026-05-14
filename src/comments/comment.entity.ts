import { CommentLike } from "../comment-likes/comment-like.entity";
import { Post } from "../posts/post.entity";
import { User } from "../users/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false
  })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'CASCADE'
  })
  post: Post;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE'
  })
  user: User;
  
  @Column({
    type: 'int',
    default: 0
  })
  likesCount: number;

  @OneToMany(() => CommentLike, (commentLike) => commentLike.comment)
  likes: CommentLike[];
}