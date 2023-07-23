import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../../user/models/user.model';

interface FollowAttrs {
  id: string;
  follower_id: string;
  following_id: string;
}

@Table({ tableName: 'follow' })
export class Follow extends Model<Follow, FollowAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
  })
  follower_id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
  })
  following_id: string;

  @BelongsTo(() => User, 'follower_id')
  follower: User;

  @BelongsTo(() => User, 'following_id')
  following: User;
}
