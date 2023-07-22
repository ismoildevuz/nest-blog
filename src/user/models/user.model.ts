import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Blog } from '../../blog/models/blog.model';

interface UserAttrs {
  id: string;
  full_name: string;
  login: string;
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
  login: string;

  @Column({
    type: DataType.STRING,
  })
  hashed_password: string;

  @HasMany(() => Blog)
  blog: Blog[];
}
