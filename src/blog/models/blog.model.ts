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
  body: string;
  // image_url: string;
  views: number;
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
  body: string;

  // @Column({
  //   type: DataType.STRING,
  // })
  // image_url: string;

  @Column({
    type: DataType.INTEGER,
  })
  views: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
  })
  user_id: string;

  @BelongsTo(() => User)
  user: User;
}
