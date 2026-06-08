import { MimeTypes } from "../posts/enum/mime-types.enum";
import { PostTypes } from "../posts/enum/post-types.enum";
import { Post } from "../posts/post.entity";
import { User } from "../users/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Upload {
  @PrimaryColumn({
    type: 'varchar',
    nullable: false,
    unique: true
  })
  id: string;
  
  @Column({
    type: 'varchar',
    nullable: false
  })
  filename: string;
  
  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
    length: 256
  })
  filePath: string;

  @Column({
    type: 'enum',
    enum: MimeTypes
  })
  fileMimeType: string;

  @Column({
    type: 'enum',
    enum: PostTypes,
    nullable: false
  })
  postType: string;

  @ManyToOne(() => User, (user) => user.uploads, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToOne(() => Post, (post) => post.upload, {
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  post: Post;

  @CreateDateColumn()
  createdAt: Date;
}