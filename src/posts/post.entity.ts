import { User } from "../users/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PostTypes } from "./enum/post-types.enum";
import { Comment } from "../comments/comment.entity";
import { Like } from "../likes/like.entity";
import { MimeTypes } from "./enum/mime-types.enum";
import { Upload } from "src/uploads/upload.entity";
import { Tag } from "src/tags/tag.entity";

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 32,
    nullable: false
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false
  })
  slug: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false
  })
  description: string;

  @Column({
    type: 'enum',
    enum: PostTypes,
    nullable: false
  })
  type: string;

  @Column({
    type: 'enum',
    enum: MimeTypes,
    nullable: false
  })
  fileMimeType: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false
  })
  fileUrl: string;
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.posts, {
    eager: true,
    onDelete: 'CASCADE',
  })
  author: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Column({
    type: 'int',
    default: 0
  })
  commentsCount: number;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @Column({
    type: 'int',
    default: 0
  })
  likesCount: number;

  @ManyToMany(() => Tag, (tag) => tag.posts, {
    eager: true
  })
  tags: Tag[];

  @OneToOne(() => Upload, (upload) => upload.post)
  upload: Upload;
}