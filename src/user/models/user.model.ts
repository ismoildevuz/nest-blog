import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Blog } from '../../blog/models/blog.model';
import { Follow } from '../../follow/models/follow.model';

interface UserAttrs {
  id: string;
  full_name: string;
  username: string;
  // email: string;
  hashed_password: string;
}

@Table({ tableName: 'user' })
export class User extends Model<User, UserAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  full_name: string;

  @Column({
    type: DataType.STRING,
  })
  username: string;

  // @Column({
  //   type: DataType.STRING,
  // })
  // email: string;

  @Column({
    type: DataType.STRING,
  })
  hashed_password: string;

  @HasMany(() => Blog)
  blog: Blog[];

  @HasMany(() => Follow, 'following_id')
  followers: Follow[];

  @HasMany(() => Follow, 'follower_id')
  followings: Follow[];
}
