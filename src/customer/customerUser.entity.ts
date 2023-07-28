import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { Customer } from './customer.entity';

@Table({ tableName: 'customer_user_tbl', freezeTableName: true })
export class CustomerUser extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @ForeignKey(() => Customer)
  @Column({ type: DataType.INTEGER })
  customerId: number;
}
