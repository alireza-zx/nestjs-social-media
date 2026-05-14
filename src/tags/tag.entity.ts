import { Post } from "src/posts/post.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Tag {
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
    length: 128,
    nullable: false,
    unique: true
  })
  slug: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Post, (post) => post.tags, {
    onDelete: 'CASCADE'
  })
  @JoinTable()
  posts: Post[];

  @Column({
    type: 'int',
    default: 0
  })
  postsCount: number;
}