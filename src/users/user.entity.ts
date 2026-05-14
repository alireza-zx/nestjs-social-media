import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Roles } from "./enums/roles.enum";
import { Session } from "../sessions/session.entity";
import { Post } from "src/posts/post.entity";
import { Comment } from "src/comments/comment.entity";
import { CommentLike } from "src/comment-likes/comment-like.entity";
import { Like } from "src/likes/like.entity";
import { Upload } from "src/uploads/upload.entity";
import { Follow } from "src/follows/follow.entity";
import { Conversation } from "src/conversations/conversation.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  avatar: string;

  @Column({
    type: 'varchar',
    length: 32,
    nullable: false
  })
  firstname: string;

  @Column({
    type: 'varchar',
    length: 32,
    nullable: true
  })
  lastname?: string;

  @Column({
    type: 'varchar',
    length: 32,
    nullable: false,
    unique: true
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
    unique: true
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false
  })
  password: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  region: string;

  @Column({
    type: 'enum',
    enum: Roles,
    nullable: false,
    default: Roles.USER
  })
  role: string;
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  passwordLastChanged: Date;

  @OneToMany(() => Session, (session) => session.user, {
    cascade: true
  })
  sessions: Session[];

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => CommentLike, (commentLike) => commentLike.user)
  commentLikes: CommentLike[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Upload, (upload) => upload.user)
  uploads: Upload[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[];

  @Column({
    type: 'int',
    default: 0
  })
  followersCount: number;

  @OneToMany(() => Follow, (follow) => follow.follower)
  followings: Follow[];

  @Column({
    type: 'int',
    default: 0
  })
  followingsCount: number;

  @OneToMany(() => Conversation, (conversation) => conversation.user1)
  conversations1: Conversation[];

  @OneToMany(() => Conversation, (conversation) => conversation.user2)
  conversations2: Conversation[];
}