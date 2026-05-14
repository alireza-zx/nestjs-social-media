import { User } from "src/users/user.entity";
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['follower', 'following'])
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.followers, {
    onDelete: 'CASCADE'
  })
  following: User;

  @ManyToOne(() => User, (user) => user.followings, {
    onDelete: 'CASCADE'
  })
  follower: User;

  @CreateDateColumn()
  createdAt: Date;
}