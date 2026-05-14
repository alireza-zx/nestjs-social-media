import { User } from "../users/user.entity";
import { Comment } from "../comments/comment.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['comment', 'user'])
export class CommentLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Comment, (comment) => comment.likes, {
    onDelete: 'CASCADE'
  })
  comment: Comment;

  @ManyToOne(() => User, (user) => user.commentLikes, {
    onDelete: 'CASCADE'
  })
  user: User;
}