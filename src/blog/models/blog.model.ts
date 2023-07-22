import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../../user/models/user.model';

interface BlogAttrs {
  id: string;
  title: string;
  description: string;
  user_id: string;
}

@Table({ tableName: 'blog' })
export class Blog extends Model<Blog, BlogAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
  })
  user_id: string;

  @BelongsTo(() => User)
  user: User;
}
